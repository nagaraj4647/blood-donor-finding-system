"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { State, City } from "country-state-city";
import { addDonor, findDonorByPhone } from "@/lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";

export default function Register() {
  const params = useSearchParams();
  const prefilledEmail = params.get("email") || "";
  const prefilledUsername = params.get("username") || "";

  const [form, setForm] = useState({
    name: prefilledUsername,
    blood_group: "",
    phone: "",
    email: prefilledEmail,
    state: "",
    district: "",
    place: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const router = useRouter();

  // ✅ Get All Indian States
  const states = State.getStatesOfCountry("IN");

  // ✅ Get Districts (Cities used as district alternative)
  const districts = form.state
    ? City.getCitiesOfState("IN", form.state)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;

    setLoading(true);

    try {
      // ✅ Duplicate Check (Firestore)
      const existing = await findDonorByPhone(form.phone);

      if (existing) {
      setLoading(false);
      setShowBack(true);

      Swal.fire({
        title: "Already Registered ⚠️",
        text: "This phone number is already registered",
        icon: "warning",
        background: "#ffffff",
        color: "#171717",
        confirmButtonColor: "#e11d48",
      });

      return;
    }
      // ✅ Create donor profile without password (already created in signup)
      if (!form.name || !form.blood_group || !form.phone || !form.state || !form.district || !form.place) {
        setLoading(false);
        Swal.fire({ title: "All fields required", text: "Please fill in all donor information", icon: "warning", background: "#ffffff", color: "#171717", confirmButtonColor: "#e11d48" });
        return;
      }

      const donorData: Record<string, any> = { ...form, available: true };

      await addDonor(donorData);

      setLoading(false);
      setShowBack(true);
      setSuccess(true);

      Swal.fire({
        title: "Success ❤️",
        text: "Donor Registered Successfully 🎉",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        background: "#ffffff",
        color: "#171717",
      });

      setForm({
        name: prefilledUsername,
        blood_group: "",
        phone: "",
        email: prefilledEmail,
        state: "",
        district: "",
        place: "",
      });
    } catch (err: any) {
      setLoading(false);
      setShowBack(true);
      Swal.fire({
        title: "Registration Failed ❌",
        text: err?.message || String(err),
        icon: "error",
        background: "#ffffff",
        color: "#171717",
        confirmButtonColor: "#e11d48",
      });
      return;
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      // Google sign-in available but user already has account from signup
      Swal.fire({ title: "Info", text: "Use your signup email to sign in", icon: "info", background: "#ffffff", color: "#171717" });
    } catch (err: any) {
      Swal.fire({ title: "Error", text: err?.message || String(err), icon: "error", background: "#ffffff", color: "#171717", confirmButtonColor: "#e11d48" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-white">
      <div className="flex items-center justify-center px-4 py-10 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-2xl">
      <h2 className="text-4xl font-bold mb-2 text-center text-slate-900">Donor Profile</h2>
      <p className="text-center text-gray-600 mb-8">Step 2: Complete Your Profile</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <p className="text-sm text-gray-600 py-2">Email: {form.email}</p>

        {/* Name */}
        <input
          placeholder="NAME"
          className="input"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        {/* Blood Group */}
        <select
          placeholder="select blood group"
          className="input bg-white text-black"
          value={form.blood_group}
          onChange={(e) =>
            setForm({ ...form, blood_group: e.target.value })
          }
          required
        >
          <option value="">SELECT BLOOD GROUP</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        {/* Phone */}
        <input
          placeholder="Phone"
          className="input"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          required
        />

        {/* Email - Read Only */}
        <input
          placeholder="Email"
          className="input bg-gray-100 text-gray-600 cursor-not-allowed"
          value={form.email}
          disabled
        />

        {/* State */}
        <select
          className="input bg-white text-black"
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

        {/* District */}
        <select
          className="input bg-white text-black"
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

        {/* Place (Same list reused) */}
        <input
  type="text"
  placeholder="MAIN PLACE"
  className="input"
  value={form.place}
  onChange={(e) =>
    setForm({ ...form, place: e.target.value })
  }
  disabled={!form.district}
  required
/>

        {/* Button */}
        <button
          type="submit"
          disabled={loading || success}
          className={`btn ${
            loading || success ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? "Registering..."
            : success
            ? "Registered ✅"
            : "❤️ Register"}
        </button>

        {/* Back Button */}
        {showBack && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="btn w-40"
            >
              🏠 Back Home
            </button>
          </div>
        )}

      <div className="mt-6 text-center">
        <button onClick={handleGoogle} className="btn w-full text-center">Sign in / Create with Google</button>
      </div>

      <p className="mt-6 text-center text-gray-600">
        Already have an account? <a href="/login" className="text-red-600 font-semibold hover:underline">Sign in</a>
      </p>

      </form>
        </div>
      </div>
    </main>
  );
}