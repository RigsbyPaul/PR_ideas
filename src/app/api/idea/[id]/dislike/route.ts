import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idea = await prisma.idea.update({
      where: { id },
      data: {
        dislikes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ dislikes: idea.dislikes });
  } catch (error) {
    console.error("Dislike error:", error);
    return NextResponse.json({ error: "Failed to dislike idea" }, { status: 500 });
  }
}
