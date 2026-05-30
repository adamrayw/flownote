import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1, "Full name is required").max(80, "Full name is too long").optional(),
    email: z.string().trim().email("Invalid email format").optional(),
  })
  .refine((data) => typeof data.name === "string" || typeof data.email === "string", {
    message: "Nothing to update",
  });

async function getAuthorizedUserId() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.auth.error === "RefreshTokenExpired") {
    return null;
  }

  return session.user.id;
}

export async function GET() {
  const userId = await getAuthorizedUserId();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  try {
    const userId = await getAuthorizedUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const parsed = updateProfileSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid request payload" },
        { status: 400 },
      );
    }

    const nextName = parsed.data.name;
    const nextEmail = parsed.data.email?.toLowerCase();

    if (nextEmail) {
      const existing = await prisma.user.findFirst({
        where: {
          email: nextEmail,
          NOT: { id: userId },
        },
        select: { id: true },
      });

      if (existing) {
        return NextResponse.json({ message: "Email is already registered" }, { status: 409 });
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(typeof nextName === "string" ? { name: nextName } : {}),
        ...(typeof nextEmail === "string" ? { email: nextEmail } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Email is already registered" }, { status: 409 });
    }

    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
