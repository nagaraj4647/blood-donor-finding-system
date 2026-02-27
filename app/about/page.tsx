"use client";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-20 animate-fade-in">

        <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">
          ❤️ About Blood Connect
        </h2>

        <p className="text-slate-600 text-lg leading-relaxed mb-6 text-center">
          Blood Connect is a community-driven platform designed to bridge the gap
          between blood donors and recipients.
        </p>

        <p className="text-slate-600 text-lg leading-relaxed mb-6 text-center">
          Our mission is simple — to save lives by making blood donation faster,
          easier, and accessible to everyone.
        </p>

        <p className="text-slate-600 text-lg leading-relaxed mb-10 text-center">
          We believe that a single donor can be a hero for someone in urgent need.
          Together, we can build a stronger and life-saving network.
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            ← Back to Home
          </Link>
        </div>

      </section>

      {/* Animations (same feel as Home) */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>

    </main>
  );
}
