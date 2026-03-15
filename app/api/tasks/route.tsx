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

type CreateTaskBody = {
  title: string;
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

export async function GET(request: NextRequest) {
  const user = await getUserByToken(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();

  const tasks = await db
    .collection("tasks")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({
    tasks: tasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
      userId: task.userId.toString(),
    })),
  });
}

export async function POST(request: NextRequest) {
  const user = await getUserByToken(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title }: CreateTaskBody = await request.json();

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const db = await getDb();

  const result = await db.collection("tasks").insertOne({
    userId: user._id,
    title: title.trim(),
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({
    message: "Task created",
    taskId: result.insertedId.toString(),
  });
}