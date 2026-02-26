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
    <main className="p-10 text-white">
      <h2 className="text-3xl font-bold mb-6">
        🩸 Available Donors {group && `(${group})`}
      </h2>

      {donors.length === 0 ? (
        <p>No donors available 😔</p>
      ) : (
        <div className="grid gap-4">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white/10 p-4 rounded-xl"
            >
              <p><b>Name:</b> {donor.name}</p>
              <p><b>Blood Group:</b> {donor.blood_group}</p>
              <p><b>Phone:</b> {donor.phone}</p>
              <p><b>State:</b> {donor.state}</p>
              <p><b>District:</b> {donor.district}</p>
              <p><b>Place:</b> {donor.place}</p>

              <a
                href={`https://wa.me/91${donor.phone}`}
                target="_blank"
                className="btn mt-3 inline-block"
              >
                💬 Message Donor
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ✅ BACK BUTTON AT BOTTOM */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => window.history.back()}
          className="btn w-40"
        >
          ← Back
        </button>
      </div>
    </main>
  );
}
