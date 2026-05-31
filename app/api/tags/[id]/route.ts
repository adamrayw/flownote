import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthorizedRaytechUser } from "@/lib/raytech-account";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthorizedRaytechUser(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const tag = await prisma.tag.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: { id: true },
  });

  if (!tag) {
    return NextResponse.json({ message: "Tag not found" }, { status: 404 });
  }

  await prisma.tag.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
