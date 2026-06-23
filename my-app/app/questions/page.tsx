"use client";

import { useEffect, useState } from "react";

export default function QuestionsPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  const loadQuestions = async () => {
    const res = await fetch("/api/questions");
    const data = await res.json();

    setQuestions(data);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const createQuestion = async () => {
    await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");

    loadQuestions();
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-5">
        Questions
      </h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter question"
        className="border p-2 mr-2"
      />

      <button
        onClick={createQuestion}
        className="border p-2"
      >
        Add
      </button>

      <ul className="mt-6">
        {questions.map((q) => (
          <li key={q._id}>{q.title}</li>
        ))}
      </ul>
    </main>
  );
}