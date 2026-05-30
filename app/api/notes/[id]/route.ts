import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title is too long").optional(),
  content: z.string().optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  tagIds: z.array(z.string()).optional(),
});

async function getAuthorizedUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.auth.error === "RefreshTokenExpired") {
    return null;
  }
  return session.user.id;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getAuthorizedUserId();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const note = await prisma.note.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      noteTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!note) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 });
  }

  return NextResponse.json({
    note: {
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
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getAuthorizedUserId();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const note = await prisma.note.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!note) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 });
  }

  const parsed = updateNoteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid request payload" },
      { status: 400 },
    );
  }

  const { title, content, isFavorite, isArchived, tagIds } = parsed.data;

  if (tagIds) {
    const validTags = await prisma.tag.findMany({
      where: {
        id: { in: tagIds },
        userId,
      },
      select: { id: true },
    });

    if (validTags.length !== new Set(tagIds).size) {
      return NextResponse.json({ message: "One or more tags are invalid" }, { status: 400 });
    }
  }

  const updated = await prisma.note.update({
    where: { id },
    data: {
      ...(typeof title === "string" ? { title } : {}),
      ...(typeof content === "string" ? { content } : {}),
      ...(typeof isFavorite === "boolean" ? { isFavorite } : {}),
      ...(typeof isArchived === "boolean" ? { isArchived } : {}),
      ...(tagIds
        ? {
            noteTags: {
              deleteMany: {},
              create: [...new Set(tagIds)].map((tagId) => ({ tagId })),
            },
          }
        : {}),
    },
    include: {
      noteTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return NextResponse.json({
    note: {
      id: updated.id,
      title: updated.title,
      content: updated.content,
      isFavorite: updated.isFavorite,
      isArchived: updated.isArchived,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      tags: updated.noteTags.map((noteTag) => ({
        id: noteTag.tag.id,
        name: noteTag.tag.name,
        color: noteTag.tag.color,
      })),
    },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getAuthorizedUserId();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const note = await prisma.note.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!note) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 });
  }

  await prisma.note.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
