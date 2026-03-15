"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Task = {
  _id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type TasksResponse = {
  tasks?: Task[];
  error?: string;
};

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  async function loadTasks(): Promise<void> {
    const res = await fetch("/api/tasks");

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    const data: TasksResponse = await res.json();
    setTasks(data.tasks || []);
    setLoading(false);
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchTasks() {
      const res = await fetch("/api/tasks");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data: TasksResponse = await res.json();

      if (isMounted) {
        setTasks(data.tasks || []);
        setLoading(false);
      }
    }

    void fetchTasks();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function addTask(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      setTitle("");
      await loadTasks();
    }
  }

  async function toggleTask(id: string, completed: boolean): Promise<void> {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });

    await loadTasks();
  }

  async function deleteTask(id: string): Promise<void> {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    await loadTasks();
  }

  async function logout(): Promise<void> {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (loading)
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 rounded-xl bg-white/70 px-6 py-10 text-sm font-medium text-gray-700 shadow-lg dark:bg-zinc-900/70 dark:text-gray-200">
          <div className="flex items-center justify-center rounded-full border-4 border-indigo-200 border-t-indigo-600 p-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-transparent border-t-indigo-600" />
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Fetching your tasks</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Hang tight — we&apos;re loading everything for you.</p>
          </div>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white/70 p-8 shadow-lg backdrop-blur dark:bg-zinc-900/70">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Tasks</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Add, complete, and remove tasks to stay on track.
            </p>
          </div>

          <button
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={addTask}>
          <input
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            placeholder="New task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-auto"
            type="submit"
          >
            Add task
          </button>
        </form>

        <ul className="mt-6 space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-950/60"
            >
              <label className="flex items-center gap-3">
                <input
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id, task.completed)}
                />
                <span
                  className={`text-sm font-medium ${
                    task.completed ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {task.title}
                </span>
              </label>

              <button
                className="rounded-md bg-red-100 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}