import os
import json
import datetime
import urllib.request
import urllib.error
from pathlib import Path
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from googleapiclient.http import MediaFileUpload

# Paths
HERMES_HOME = Path("/home/paul/.hermes/profiles/harvey")
TOKEN_PATH = HERMES_HOME / "google_token.json"
BACKUP_DIR = Path("/home/paul/PR_ideas/backups")
LAST_HASH_PATH = BACKUP_DIR / "last_db_hash.txt"

# Ensure backup dir exists
BACKUP_DIR.mkdir(parents=True, exist_ok=True)

# Turso Config
TURSO_URL = os.environ.get("TURSO_DATABASE_URL")
TURSO_TOKEN = os.environ.get("TURSO_AUTH_TOKEN")

def query_turso(sql):
    # Map libsql:// to https://
    api_url = TURSO_URL.replace("libsql://", "https://")
    if not api_url.startswith("https://"):
        api_url = f"https://{api_url}"
    
    endpoint = f"{api_url}/v2/pipeline"
    headers = {
        "Authorization": f"Bearer {TURSO_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "requests": [{"type": "execute", "stmt": {"sql": sql}}]
    }
    
    req = urllib.request.Request(endpoint, data=json.dumps(payload).encode(), headers=headers, method="POST")
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode())
        result = res_data["results"][0]
        if result["type"] == "error":
            raise Exception(result["error"]["message"])
        return result["response"]["result"]

def get_drive_service():
    if not TOKEN_PATH.exists():
        raise FileNotFoundError(f"Google token not found at {TOKEN_PATH}")
    creds = Credentials.from_authorized_user_file(str(TOKEN_PATH))
    return build('drive', 'v3', credentials=creds)

def get_or_create_folder(service, folder_name):
    query = f"name = '{folder_name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    results = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
    files = results.get('files', [])
    if files:
        return files[0]['id']
    
    file_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder'
    }
    folder = service.files().create(body=file_metadata, fields='id').execute()
    return folder.get('id')

def backup_turso():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    if not TURSO_URL or not TURSO_TOKEN:
        print("Error: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set.")
        return None

    try:
        # Get counts as a simple change detector
        res = query_turso("SELECT (SELECT COUNT(*) FROM Idea) + (SELECT COUNT(*) FROM Comment)")
        current_hash = str(res["rows"][0][0].get("value", "0"))
        
        if LAST_HASH_PATH.exists() and LAST_HASH_PATH.read_text().strip() == current_hash:
            print("No changes detected in database. Skipping backup.")
            return None
        
        # If changed, perform "dump"
        ideas_res = query_turso("SELECT * FROM Idea")
        comments_res = query_turso("SELECT * FROM Comment")
        
        # Helper to convert rows to dict
        def rows_to_dicts(res):
            cols = [c["name"] for c in res["cols"]]
            data = []
            for row in res["rows"]:
                # Turso v2 returns values as objects like {"type": "string", "value": "..."}
                row_values = [r.get("value") for r in row]
                data.append(dict(zip(cols, row_values)))
            return data

        data = {
            "ideas": rows_to_dicts(ideas_res),
            "comments": rows_to_dicts(comments_res)
        }
        
        backup_json = BACKUP_DIR / f"pr_ideas_backup_{timestamp}.json"
        backup_json.write_text(json.dumps(data, indent=2))
        LAST_HASH_PATH.write_text(current_hash)
        
        print(f"Database snapshot created: {backup_json.name}")
        return backup_json
    except Exception as e:
        print(f"Backup failed during DB fetch: {e}")
        return None

def upload_and_cleanup(file_path):
    if not file_path: return
    
    try:
        service = get_drive_service()
        folder_id = get_or_create_folder(service, "PR_Ideas_Backups")
        
        file_metadata = {
            'name': file_path.name,
            'parents': [folder_id]
        }
        media = MediaFileUpload(str(file_path), mimetype='application/json')
        service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        print(f"Uploaded {file_path.name} to Google Drive.")
        
        # Cleanup Drive: Keep last 3
        query = f"'{folder_id}' in parents and trashed = false"
        results = service.files().list(q=query, spaces='drive', fields='files(id, name, createdTime)', orderBy="createdTime desc").execute()
        files = results.get('files', [])
        
        if len(files) > 3:
            for f in files[3:]:
                service.files().delete(fileId=f['id']).execute()
                print(f"Deleted old backup from Drive: {f['name']}")
    except Exception as e:
        print(f"Upload failed: {e}")

if __name__ == "__main__":
    path = backup_turso()
    if path:
        upload_and_cleanup(path)
