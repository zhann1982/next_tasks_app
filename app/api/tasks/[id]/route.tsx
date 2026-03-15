import { getDb } from "@/lib/mongodb";
import { SESSION_COOKIE } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

type UserDocument = {
  _id: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  sessionToken?: string;
  createdAt?: Date;
};

type UpdateTaskBody = {
  title?: string;
  completed?: boolean;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getUserByToken(
  request: NextRequest
): Promise<UserDocument | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const db = await getDb();

  return (await db.collection("users").findOne({
    sessionToken: token,
  })) as UserDocument | null;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await getUserByToken(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { title, completed }: UpdateTaskBody = await request.json();

  const db = await getDb();

  const updateData: {
    updatedAt: Date;
    title?: string;
    completed?: boolean;
  } = {
    updatedAt: new Date(),
  };

  if (typeof title === "string") updateData.title = title.trim();
  if (typeof completed === "boolean") updateData.completed = completed;

  const result = await db.collection("tasks").updateOne(
    {
      _id: new ObjectId(id),
      userId: user._id,
    },
    { $set: updateData }
  );

  if (!result.matchedCount) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Task updated" });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const user = await getUserByToken(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = await getDb();

  const result = await db.collection("tasks").deleteOne({
    _id: new ObjectId(id),
    userId: user._id,
  });

  if (!result.deletedCount) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Task deleted" });
}