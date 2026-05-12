import { env } from "./env";

export type Classification = "EXPENSE" | "IDEA" | "OTHER";

export async function classifyInbound(subject: string, body: string, hasAttachments: boolean): Promise<Classification> {
  const content = `${subject} ${body}`.toLowerCase();
  
  // High confidence keywords for expenses
  if (content.includes("receipt") || content.includes("invoice") || content.includes("bank statement") || content.includes("bill")) {
    return "EXPENSE";
  }
  
  // Keywords or visual content for ideas
  if (content.includes("idea") || content.includes("invention") || content.includes("doodle") || hasAttachments) {
    return "IDEA";
  }
  
  return "OTHER";
}
