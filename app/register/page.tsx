"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { State, City } from "country-state-city";
import { addDonor, findDonorByPhone, signUpWithEmail, signInWithGoogle } from "@/lib/firebase";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    blood_group: "",
    phone: "",
    email: "",
    password: "",
    state: "",
    district: "",
    place: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showBack, setShowBack] = useState(false);

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
        background: "#111",
        color: "#fff",
        confirmButtonColor: "#e11d48",
      });

      return;
    }
      // ✅ Create auth user (email/password) then insert into Firestore
      if (!form.email || !form.password) {
        setLoading(false);
        Swal.fire({ title: "Email & password required", text: "Please provide email and password to create an account.", icon: "warning", background: "#111", color: "#fff", confirmButtonColor: "#e11d48" });
        return;
      }

      const cred = await signUpWithEmail(form.email, form.password);

      // Insert donor data into Firestore; attach uid if available
      const donorData: Record<string, any> = { ...form, available: true };
      if (cred?.user?.uid) donorData.uid = cred.user.uid;

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
        background: "#111",
        color: "#fff",
      });

      setForm({
        name: "",
        blood_group: "",
        phone: "",
        email: "",
        password: "",
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
        background: "#1b1818",
        color: "#fff",
        confirmButtonColor: "#e11d48",
      });
      return;
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      Swal.fire({ title: "Signed in with Google", icon: "success", timer: 1400, showConfirmButton: false, background: "#111", color: "#fff" });
      window.location.href = "/";
    } catch (err: any) {
      Swal.fire({ title: "Google Sign-in failed", text: err?.message || String(err), icon: "error", background: "#1b1818", color: "#fff", confirmButtonColor: "#e11d48" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6">🩸 Donor Registration</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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

        {/* Email */}
        <input
          placeholder="Email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
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
        <button onClick={handleGoogle} className="btn">Sign up / Sign in with Google</button>
      </div>

      <p className="mt-4 text-center">
        Already have an account? <a href="/login" className="text-red-400 underline">Sign in</a>
      </p>

      </form>
    </main>
  );
}