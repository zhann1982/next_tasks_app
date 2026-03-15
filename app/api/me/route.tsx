import { getDb } from "@/lib/mongodb";
import { SESSION_COOKIE } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

type SafeUser = {
  _id: ObjectId;
  username: string;
  email: string;
  createdAt?: Date;
};

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const db = await getDb();

  const user = (await db.collection("users").findOne(
    { sessionToken: token },
    { projection: { passwordHash: 0, sessionToken: 0 } }
  )) as SafeUser | null;

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      ...user,
      _id: user._id.toString(),
    },
  });
}