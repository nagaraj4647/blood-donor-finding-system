"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { findDonors, updateDonorAvailability, onAuthStateChange } from "@/lib/firebase";

export default function Dashboard() {
  const [donors, setDonors] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    const unsub = onAuthStateChange((user) => {
      if (!user) router.push("/login");
      else fetchDonors();
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDonors = async () => {
    try {
      const data = await findDonors();
      setDonors(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      await updateDonorAvailability(id, !current);
      fetchDonors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold mb-8 text-slate-900">Your Donor Profile</h2>

        <div className="grid gap-4">
          {donors.map((donor) => (
            <div key={donor.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-white shadow-sm hover:shadow-md transition">
              <div>
                <p className="font-bold text-slate-900">{donor.name}</p>
                <p className="text-gray-600">{donor.blood_group} • {donor.state} {donor.district} {donor.place}</p>
              </div>

              <button
                onClick={() => toggleAvailability(donor.id, donor.available)}
                className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                  donor.available ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                {donor.available ? "✓ Available" : "✕ Unavailable"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
