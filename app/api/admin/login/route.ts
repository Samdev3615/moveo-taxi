import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!process.env.ADMIN_SECRET || password !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_session", process.env.ADMIN_SECRET, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
