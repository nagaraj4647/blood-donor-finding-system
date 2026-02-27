"use client";

import { useState } from "react";
import { addRequest } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { State, City } from "country-state-city";

export default function RequestBlood() {
  const router = useRouter();

  const [form, setForm] = useState({
    patient: "",
    blood_group: "",
    hospital: "",
    state: "",
    district: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const states = State.getStatesOfCountry("IN");
  const districts = form.state ? City.getCitiesOfState("IN", form.state) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;

    setLoading(true);
    const locationText = form.district || form.state;
    const payload = { ...form, location: locationText };

    try {
      await addRequest(payload);
    } catch (err: any) {
      setLoading(false);
      setShowBack(true);

      Swal.fire({
        title: "Error",
        text: err?.message || String(err),
        icon: "error",
        background: "#111",
        color: "#fff",
        confirmButtonColor: "#e11d48",
      });

      return;
    }

    setLoading(false);
    setShowBack(true);
    setSuccess(true);

    Swal.fire({
      title: "Request Sent",
      text: "Requester Successfully",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
      background: "#111",
      color: "#fff",
    });

    router.push(`/donors?group=${encodeURIComponent(form.blood_group)}`);
  };

  return (
    <main className="min-h-screen bg-[#eef0f3] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-slate-300 bg-white p-8 shadow-md text-black">
        <h2 className="mb-6 text-center text-4xl font-bold text-red-600">Blood Request</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            placeholder="Patient Name"
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
            value={form.patient}
            onChange={(e) => setForm({ ...form, patient: e.target.value })}
            required
          />

          <select
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
            value={form.blood_group}
            onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          <input
            placeholder="Hospital"
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
            value={form.hospital}
            onChange={(e) => setForm({ ...form, hospital: e.target.value })}
            required
          />

          <select
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
            value={form.state}
            onChange={(e) =>
              setForm({
                ...form,
                state: e.target.value,
                district: "",
              })
            }
            required
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-70"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            disabled={!form.state}
            required
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Contact Number"
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 ${
              loading || success ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {loading ? "Sending..." : success ? "Request Sent" : "Request Blood"}
          </button>

          {showBack && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="rounded-xl bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Back Home
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
