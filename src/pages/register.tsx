import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");

  const nextUrl = search.get("next") || "/app";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: call your backend here…
    navigate(nextUrl);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* 1 colonne sur mobile (image au-dessus), 2 colonnes en ≥lg */}
      <main className="grid flex-1 grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-2">
        {/* Image side — visible sur mobile aussi */}
        <section className="relative block">
          {/* Hauteur adaptée mobile/tablette, plein écran en desktop */}
          <div className="relative h-[45vh] sm:h-[52vh] lg:h-full">
            <img
              src="/climate.png"  // Assure-toi que le fichier est bien dans /public
              alt="Weather illustration"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            {/* Overlay pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-black/20" />
            {/* Texte optionnel sur l'image */}
            <div className="absolute inset-x-0 bottom-4 sm:bottom-6 lg:bottom-8 px-5 sm:px-8 lg:px-10">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white drop-shadow">
                  Plan with probabilities, not forecasts.
                </h2>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/90">
                  ClimaTrack estimates the likelihood of very hot, cold, windy, humid or uncomfortable
                  conditions for any place and day of year — powered by NASA archives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form side */}
        <section className="flex items-center justify-center bg-gray-50 px-5 sm:px-8 py-8 lg:py-10">
          <div className="w-full max-w-md rounded-2xl bg-white/95 p-6 shadow-lg ring-1 ring-gray-100 backdrop-blur">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
              <p className="text-sm text-slate-600">
                Access your personalized weather probabilities.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
                <input
                  type="password"
                  value={pwd2}
                  onChange={(e) => setPwd2(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-3 py-2 font-medium text-white outline-none transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/40"
              >
                Create account
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-700">
              Already have an account?{" "}
              <Link
                className="font-medium text-blue-600 hover:underline"
                to={`/login?next=${encodeURIComponent(nextUrl)}`}
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
