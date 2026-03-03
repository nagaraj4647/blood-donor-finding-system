"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { State, City } from "country-state-city";
import { addDonor, findDonorByPhone } from "@/lib/firebase";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    blood_group: "",
    phone: "",
    state: "",
    district: "",
    place: "",
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

    try {
      const existing = await findDonorByPhone(form.phone);

      if (existing) {
        setLoading(false);
        setShowBack(true);

        Swal.fire({
          title: "Already Registered",
          text: "This phone number is already registered",
          icon: "warning",
          background: "#111",
          color: "#fff",
          confirmButtonColor: "#e11d48",
        });

        return;
      }

      const donorData: Record<string, any> = { ...form, available: true };
      await addDonor(donorData);

      setLoading(false);
      setShowBack(true);
      setSuccess(true);

      Swal.fire({
        title: "Success",
        text: "Donor Registered Successfully",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        background: "#111",
        color: "#fff",
      });

      setForm({
        name: "",
        blood_group: "",
        phone: "",
        state: "",
        district: "",
        place: "",
      });
    } catch (err: any) {
      setLoading(false);
      setShowBack(true);

      Swal.fire({
        title: "Registration Failed",
        text: err?.message || String(err),
        icon: "error",
        background: "#1b1818",
        color: "#fff",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#eef0f3] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-slate-300 bg-white p-8 shadow-md text-black">
        <h2 className="mb-6 text-center text-4xl font-bold text-red-600">Donor Registration</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            placeholder="Name"
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            placeholder="Phone"
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                place: "",
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
            onChange={(e) =>
              setForm({
                ...form,
                district: e.target.value,
                place: "",
              })
            }
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
            type="text"
            placeholder="Main Place"
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-70"
            value={form.place}
            onChange={(e) => setForm({ ...form, place: e.target.value })}
            disabled={!form.district}
            required
          />

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 ${
              loading || success ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {loading ? "Registering..." : success ? "Registered" : "Register"}
          </button>

          {showBack && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="rounded-xl bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                ← 🏠Back Home
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
