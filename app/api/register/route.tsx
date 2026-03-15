import { getDb } from "@/lib/mongodb";
import {
  hashPassword,
  generateSessionToken,
  SESSION_COOKIE,
} from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type RegisterBody = {
  username: string;
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  try {
    const { username, email, password }: RegisterBody = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Trim and lowercase email before DB checks
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    // Use trimmed/lowercased email and trimmed username for DB checks
    const existingUser = await db.collection("users").findOne({
      $or: [{ trimmedEmail }, { trimmedUsername }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const sessionToken = generateSessionToken();

    const result = await db.collection("users").insertOne({
      username,
      email,
      passwordHash,
      sessionToken,
      createdAt: new Date(),
    });

    const response = NextResponse.json({
      message: "Registered successfully",
      user: {
        id: result.insertedId.toString(),
        username,
        email,
      },
    });

    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}