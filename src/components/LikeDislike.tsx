"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface LikeDislikeProps {
  ideaId: string;
  initialLikes: number;
  initialDislikes: number;
}

export default function LikeDislike({ ideaId, initialLikes, initialDislikes }: LikeDislikeProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiking) return;

    setIsLiking(true);
    try {
      const res = await fetch(`/api/idea/${ideaId}/like`, { method: "POST" });
      const data = await res.json();
      if (data.likes !== undefined) setLikes(data.likes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisliking) return;

    setIsDisliking(true);
    try {
      const res = await fetch(`/api/idea/${ideaId}/dislike`, { method: "POST" });
      const data = await res.json();
      if (data.dislikes !== undefined) setDislikes(data.dislikes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDisliking(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={handleLike}
        disabled={isLiking}
        className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-500 transition-colors disabled:opacity-50"
      >
        <ThumbsUp className={`w-4 h-4 ${isLiking ? "animate-bounce" : ""}`} />
        <span className="text-sm font-medium">{likes}</span>
      </button>
      <button 
        onClick={handleDislike}
        disabled={isDisliking}
        className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors disabled:opacity-50"
      >
        <ThumbsDown className={`w-4 h-4 ${isDisliking ? "animate-bounce" : ""}`} />
        <span className="text-sm font-medium">{dislikes}</span>
      </button>
    </div>
  );
}
