import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title is too long"),
  content: z.string().optional().default(""),
  tagIds: z.array(z.string()).optional().default([]),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.auth.error === "RefreshTokenExpired") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const tagId = searchParams.get("tagId")?.trim() ?? "";
  const favoriteOnly = searchParams.get("favorite") === "true";
  const archivedOnly = searchParams.get("archived") === "true";

  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(tagId
        ? {
            noteTags: {
              some: {
                tagId,
              },
            },
          }
        : {}),
      ...(favoriteOnly ? { isFavorite: true } : {}),
      ...(archivedOnly ? { isArchived: true } : { isArchived: false }),
    },
    include: {
      noteTags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json({
    notes: notes.map((note) => ({
      id: note.id,
      title: note.title,
      content: note.content,
      isFavorite: note.isFavorite,
      isArchived: note.isArchived,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      tags: note.noteTags.map((noteTag) => ({
        id: noteTag.tag.id,
        name: noteTag.tag.name,
        color: noteTag.tag.color,
      })),
    })),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.auth.error === "RefreshTokenExpired") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = createNoteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid request payload" },
      { status: 400 },
    );
  }

  const { title, content, tagIds } = parsed.data;

  if (tagIds.length > 0) {
    const validTags = await prisma.tag.findMany({
      where: {
        id: { in: tagIds },
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (validTags.length !== new Set(tagIds).size) {
      return NextResponse.json({ message: "One or more tags are invalid" }, { status: 400 });
    }
  }

  const created = await prisma.note.create({
    data: {
      title,
      content,
      isFavorite: false,
      isArchived: false,
      userId: session.user.id,
      noteTags: {
        create: [...new Set(tagIds)].map((tagId) => ({ tagId })),
      },
    },
    include: {
      noteTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      note: {
        id: created.id,
        title: created.title,
        content: created.content,
        isFavorite: created.isFavorite,
        isArchived: created.isArchived,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
        tags: created.noteTags.map((noteTag) => ({
          id: noteTag.tag.id,
          name: noteTag.tag.name,
          color: noteTag.tag.color,
        })),
      },
    },
    { status: 201 },
  );
}
