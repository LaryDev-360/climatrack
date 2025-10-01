import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const nextUrl = search.get("next") || "/app";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: call your backend login endpoint here
    navigate(nextUrl);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* 1 colonne sur mobile (image au-dessus), 2 colonnes sur desktop */}
      <main className="grid flex-1 grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-2">
        {/* Illustration side (visible mobile aussi) */}
        <section className="relative block">
          <div className="relative h-[45vh] sm:h-[52vh] lg:h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <img
              src="/weather.png" // ton SVG ou PNG placé dans /public
              alt="Weather illustration"
              className="max-h-full max-w-full object-contain p-6"
            />
            <div className="absolute bottom-6 sm:bottom-8 px-5 sm:px-8 text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 drop-shadow">
                Welcome back to ClimaTrack
              </h2>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-700/90">
                Log in to explore weather probabilities powered by NASA archives.
              </p>
            </div>
          </div>
        </section>

        {/* Form side */}
        <section className="flex items-center justify-center bg-gray-50 px-5 sm:px-8 py-8 lg:py-10">
          <div className="w-full max-w-md rounded-2xl bg-white/95 p-6 shadow-lg ring-1 ring-gray-100 backdrop-blur">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Sign in to ClimaTrack</h1>
              <p className="text-sm text-slate-600">
                Access your dashboard and saved queries.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  placeholder="Your password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-3 py-2 font-medium text-white outline-none transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/40"
              >
                Sign in
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-700">
              New to ClimaTrack?{" "}
              <Link
                className="font-medium text-blue-600 hover:underline"
                to={`/register?next=${encodeURIComponent(nextUrl)}`}
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
