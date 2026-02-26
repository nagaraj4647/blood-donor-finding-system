"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <main className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/95 border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-900">Blood Connect</h1>

          <div className="flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <Link href="/about" className="hover:text-slate-900">About</Link>
            <Link href="/FAQ" className="hover:text-slate-900">FAQ</Link>
            <Link href="/contact" className="text-red-600 font-semibold">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 py-20">

        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">
          📞 Contact Us
        </h1>

        <p className="text-slate-600 text-center mb-12">
          Have questions? Reach out to us anytime.
        </p>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">

          {/* Email */}
          <div className="p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <Mail className="w-8 h-8 text-red-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Email</h3>

            <a
              href="mailto:blooddonor@gmail.com"
              className="text-slate-600 hover:text-red-600 transition"
            >
              blooddonor@gmail.com
            </a>
          </div>

          {/* Phone */}
          <div className="p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <Phone className="w-8 h-8 text-red-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>

            <a
              href="tel:6379835744"
              className="text-slate-600 hover:text-red-600 transition"
            >
              6379835744
            </a>
          </div>

          {/* Location */}
          <div className="p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <MapPin className="w-8 h-8 text-red-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Location</h3>

            <p className="text-slate-600">
              Renganayagi Varatharaj College of Engineering, Sivakasi
            </p>
          </div>

        </div>

        {/* Google Map */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 mb-10">
          <iframe
            src="https://www.google.com/maps?q=Renganayagi+Varatharaj+College+of+Engineering,+Sivakasi&output=embed"
            width="100%"
            height="320"
            loading="lazy"
          ></iframe>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition hover:shadow-lg"
          >
            ← Back Home
          </Link>
        </div>

      </section>
    </main>
  );
}