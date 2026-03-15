"use client";

import { FormEvent, ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginForm = {
  email: string;
  password: string;
};

type LoginResponse = {
  error?: string;
  message?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data: LoginResponse = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/tasks");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col gap-8 items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Please login to manage your tasks and boost your productivity.
        </p>
      </div>
      <div className="w-full max-w-md bg-white/70 dark:bg-zinc-900/70 shadow-lg rounded-xl p-8 backdrop-blur">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="submit"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{' '}
          <a
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            href="/register"
          >
            Register here
          </a>
        </p>
      </div>
    </main>
  );
}
