import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { hash, compare } from "bcrypt";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const dataToUpdate: any = {};
    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.email !== undefined) dataToUpdate.email = body.email;
    if (body.image !== undefined) dataToUpdate.image = body.image;

    if (body.currentPassword && body.newPassword) {
      const dbUser = await db.user.findUnique({ where: { id: session.user.id } });
      if (!dbUser?.password) {
         return NextResponse.json({ message: "Authentication provider mismatch" }, { status: 400 });
      }
      const isPasswordValid = await compare(body.currentPassword, dbUser.password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid current password" }, { status: 400 });
      }
      dataToUpdate.password = await hash(body.newPassword, 10);
    }

    const updated = await db.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ message: "Settings updated successfully", user: updated });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
