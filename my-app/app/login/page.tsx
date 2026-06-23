"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("loggedIn", "true");
      router.push("/questions");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        Login
      </h1>

      <input
        type="text"
        placeholder="Username"
        className="border p-2 block mb-3 w-64"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 block mb-3 w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="border px-4 py-2 rounded"
      >
        Login
      </button>
    </main>
  );
}