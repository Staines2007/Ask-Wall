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
    <main className="min-h-screen flex items-center justify-center">
      <div className="border rounded-lg p-8 shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Ask Wall Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full border p-2 rounded hover:bg-gray-100"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Demo Credentials:
          <br />
          Username: <strong>admin</strong>
          <br />
          Password: <strong>admin123</strong>
        </p>
      </div>
    </main>
  );
}