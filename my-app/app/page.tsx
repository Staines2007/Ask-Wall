export default function Home() {
  return (
    <main className="min-h-screen bg-radial from-slate-900 via-zinc-950 to-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Decorative gradient spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8 p-8 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/20 text-white text-4xl font-extrabold mb-2 select-none animate-pulse">
            A
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Ask Wall
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            A secure and anonymous space to post questions, read from others, and participate in discussion. Join the wall and share your curiosity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-4">
          <a
            href="/questions"
            className="flex-1 text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-600/25 text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 active:scale-[0.98] text-sm"
          >
            Enter Question Wall
          </a>
          <a
            href="/login"
            className="flex-1 text-center bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 active:scale-[0.98] text-sm"
          >
            Log In / Register
          </a>
        </div>

        <div className="border-t border-zinc-850 pt-6 text-[11px] text-zinc-500">
          Powered by Next.js & MongoDB
        </div>
      </div>
    </main>
  );
}