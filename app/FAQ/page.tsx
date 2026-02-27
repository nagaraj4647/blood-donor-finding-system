"use client";

import Link from "next/link";

export default function FAQ() {
  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center md:pl-24">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-8">
            Frequently Asked Questions
          </h1>

          <div className="space-y-6 text-slate-700">
            <div>
              <h3 className="font-semibold">Who can donate blood?</h3>
              <p>Any healthy individual aged 18-65 years can donate blood, subject to medical eligibility.</p>
            </div>

            <div>
              <h3 className="font-semibold">How often can I donate?</h3>
              <p>Typically every 3 months for whole blood donation.</p>
            </div>

            <div>
              <h3 className="font-semibold">Is blood donation safe?</h3>
              <p>Yes, it is completely safe. Sterile, single-use equipment is always used.</p>
            </div>

            <div>
              <h3 className="font-semibold">What if I urgently need blood?</h3>
              <p>Use the "Request Blood" feature to find available donors near your location.</p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block mt-10 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
          >
            Back Home
          </Link>
        </div>

        <div className="hidden md:flex justify-center">
          <img
            src="/faq.png"
            alt="FAQ Illustration"
            className="w-[380px] object-contain"
          />
        </div>
      </div>
    </main>
  );
}
