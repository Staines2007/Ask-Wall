export default function Home() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-6">Ask Wall</h1>

      <p className="mb-4">
        Post anonymous questions and view questions from others.
      </p>

      <div className="space-y-4">
        <a
          href="/questions"
          className="block p-4 border rounded"
        >
          View Questions
        </a>

        <a
          href="/login"
          className="block p-4 border rounded"
        >
          Login
        </a>
      </div>
    </main>
  );
}