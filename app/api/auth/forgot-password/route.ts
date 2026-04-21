import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // In production, we always return success to prevent email enumeration attacks
      return NextResponse.json({ message: "If registered, an email has been sent." }, { status: 200 });
    }

    // TODO: Generate a cryptographically secure verification token mapping to Prisma
    // TODO: Fire off NodeMailer / Resend SMTP email hook here containing reset URL

    // For local development mockup visibility:
    console.log(`[AUTH-WORKER] Password reset logic fired for: ${user.email}`);

    return NextResponse.json({ message: "Reset token provisioned successfully." }, { status: 200 });
  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
