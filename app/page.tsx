

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to Next Tasks App</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          A simple task management application built with Next.js and Tailwind CSS.
        </p>

        <div className="mt-6 flex gap-4">
          <a
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Register
          </a>
          <a
            href="/login"
            className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Login
          </a>
        </div>
      </main>
    </div>
  );
}
