import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthorizedRaytechUser } from "@/lib/raytech-account";

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1, "Full name is required").max(80, "Full name is too long").optional(),
    email: z.string().trim().email("Invalid email format").optional(),
  })
  .refine((data) => typeof data.name === "string" || typeof data.email === "string", {
    message: "Nothing to update",
  });

export async function GET(request: Request) {
  const user = await getAuthorizedRaytechUser(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const localUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: localUser?.createdAt ?? new Date().toISOString(),
      updatedAt: localUser?.updatedAt ?? new Date().toISOString(),
    },
  });
}

export async function PATCH(request: Request) {
  const user = await getAuthorizedRaytechUser(request);
  if (!user) {
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
  const nextEmail = parsed.data.email;

  if ((nextEmail && nextEmail !== user.email) || (nextName && nextName !== user.name)) {
    return NextResponse.json(
      {
        message:
          "Profile fields are managed by RayTech Account. Update your profile from auth.raytech.cloud.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
}
