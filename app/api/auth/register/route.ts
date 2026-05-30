import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid request payload" },
        { status: 400 },
      );
    }

    const { fullName, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    await prisma.user.create({
      data: {
        name: fullName,
        email: normalizedEmail,
        passwordHash,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("register_error", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ message: "Email is already registered" }, { status: 409 });
      }

      if (error.code === "P2021") {
        return NextResponse.json(
          { message: "Database table is missing. Run Prisma migration first." },
          { status: 500 },
        );
      }
    }

    const message = error instanceof Error ? error.message : "";
    if (message.includes("Authentication failed against database server")) {
      return NextResponse.json(
        { message: "Database authentication failed. Check DATABASE_URL in .env." },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Failed to register user" }, { status: 500 });
  }
}
