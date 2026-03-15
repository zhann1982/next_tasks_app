import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import {
  comparePassword,
  generateSessionToken,
  SESSION_COOKIE,
} from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type LoginBody = {
  email: string;
  password: string;
};

type UserDocument = {
  _id:  ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  sessionToken?: string;
  createdAt?: Date;
};

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginBody = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const user = (await db.collection("users").findOne({
      email,
    })) as UserDocument | null;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const sessionToken = generateSessionToken();

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { sessionToken } }
    );

    const response = NextResponse.json({
      message: "Logged in successfully",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
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