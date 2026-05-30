import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createTagSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required").max(30, "Tag name is too long"),
  color: z.string().trim().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.auth.error === "RefreshTokenExpired") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tags = await prisma.tag.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: {
          noteTags: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json({
    tags: tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      count: tag._count.noteTags,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.auth.error === "RefreshTokenExpired") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = createTagSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid request payload" },
      { status: 400 },
    );
  }

  const { name, color } = parsed.data;
  const normalizedName = name.trim();

  const existingTag = await prisma.tag.findFirst({
    where: {
      userId: session.user.id,
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
    },
    select: { id: true },
  });

  if (existingTag) {
    return NextResponse.json({ message: "Tag already exists" }, { status: 409 });
  }

  const createdTag = await prisma.tag.create({
    data: {
      name: normalizedName,
      color: color || null,
      userId: session.user.id,
    },
  });

  return NextResponse.json(
    {
      tag: {
        id: createdTag.id,
        name: createdTag.name,
        color: createdTag.color,
        count: 0,
      },
    },
    { status: 201 },
  );
}
