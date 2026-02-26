"use client";

import { useEffect, useState } from "react";
import { findDonors } from "@/lib/firebase";
import { useSearchParams } from "next/navigation";

export default function DonorsPage() {
  const params = useSearchParams();

  const group = params.get("group");
  const location = params.get("location");

  const [donors, setDonors] = useState<any[]>([]);

  useEffect(() => {
    
    fetchDonors();
  }, [group, location]);

  const fetchDonors = async () => {
    try {
      const data = await findDonors(group || undefined, location || undefined);
      setDonors(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold mb-8 text-slate-900">
          🩸 Available Donors {group && `(${group})`}
        </h2>

      {donors.length === 0 ? (
        <p className="text-gray-600 text-center py-10">No donors available matching your request 😔</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-2xl font-bold text-red-600 mb-2">{donor.blood_group}</p>
                <p className="text-xl font-semibold text-slate-900">{donor.name}</p>
              </div>
              <div className="space-y-2 text-gray-700">
                <p><b>Phone:</b> {donor.phone}</p>
                <p><b>Location:</b> {donor.place}, {donor.district}, {donor.state}</p>
              </div>

              <a
                href={`https://wa.me/91${donor.phone}`}
                target="_blank"
                className="btn mt-4 inline-block w-full text-center"
              >
                💬 Contact Donor
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ✅ BACK BUTTON AT BOTTOM */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => window.history.back()}
          className="btn px-6 py-3"
        >
          ← Back
        </button>
      </div>
      </div>
    </main>
  );
}
