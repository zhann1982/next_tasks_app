import { getDb } from "@/lib/mongodb";
import { SESSION_COOKIE } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (token) {
      const db = await getDb();

      await db.collection("users").updateOne(
        { sessionToken: token },
        { $unset: { sessionToken: "" } }
      );
    }

    const response = NextResponse.json({ message: "Logged out" });

    response.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}