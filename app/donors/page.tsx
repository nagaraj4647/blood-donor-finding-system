"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { findDonors } from "@/lib/firebase";

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
    <main className="min-h-screen bg-white p-10 text-black">
      <h2 className="mb-6 text-3xl font-bold">Available Donors {group && `(${group})`}</h2>

      {donors.length === 0 ? (
        <p>No donors available</p>
      ) : (
        <div className="grid gap-4">
          {donors.map((donor) => (
            <div key={donor.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p>
                <b>Name:</b> {donor.name}
              </p>
              <p>
                <b>Blood Group:</b> {donor.blood_group}
              </p>
              <p>
                <b>Phone:</b>{" "}
                <a href={`tel:+91${donor.phone}`} className="text-blue-700 underline hover:text-blue-900">
                  {donor.phone}
                </a>
              </p>
              <p>
                <b>State:</b> {donor.state}
              </p>
              <p>
                <b>District:</b> {donor.district}
              </p>
              <p>
                <b>Place:</b> {donor.place}
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/91${donor.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn inline-block"
                >
                  Message Donor
                </a>
                <a
                  href={`tel:+91${donor.phone}`}
                  className="inline-block rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                >
                  Call Donor
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <button onClick={() => (window.location.href = "/")} className="btn w-40">
          ← 🏠Back Home
        </button>
      </div>
    </main>
  );
}
