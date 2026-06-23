export default function LoginPage() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Login
      </h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 block my-2"
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 block my-2"
      />

      <button className="border p-2">
        Login
      </button>
    </main>
  );
}