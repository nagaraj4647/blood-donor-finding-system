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
    <main>
      <section className="p-10">
        <h2 className="text-3xl font-bold mb-6">Donor Dashboard</h2>

        <div className="grid gap-4">
          {donors.map((donor) => (
            <div key={donor.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold">{donor.name}</p>
                <p>{donor.blood_group} • {donor.state} {donor.district} {donor.place}</p>
              </div>

              <button
                onClick={() => toggleAvailability(donor.id, donor.available)}
                className={`px-3 py-1 rounded-lg text-white ${
                  donor.available ? "bg-green-600" : "bg-gray-500"
                }`}
              >
                {donor.available ? "Available" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="btn w-48"
          >
            Back to Home
          </button>
        </div>
      </section>
    </main>
  );
}
