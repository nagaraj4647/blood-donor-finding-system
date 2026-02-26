"use client";

import { useState } from "react";
import { addRequest } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function RequestBlood() {
  const router = useRouter();

  const [form, setForm] = useState({
    patient: "",
    blood_group: "",
    hospital: "",
    location: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);     // ✅ Track success
  const [showBack, setShowBack] = useState(false);   // ✅ Control Back button

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || success) return;

    setLoading(true);

    console.log("Submitting form:", form);

    try {
      await addRequest(form);
    } catch (err: any) {
      setLoading(false);
      setShowBack(true);

      Swal.fire({
        title: "Error ❌",
        text: err?.message || String(err),
        icon: "error",
        background: "#ffffff",
        color: "#171717",
        confirmButtonColor: "#e11d48",
      });

      return;
    }

    setLoading(false);
    setShowBack(true); // ✅ Show back button in ALL outcomes

    setSuccess(true); // ✅ Mark success

    Swal.fire({
      title: "Request Sent 🚑",
      text: "Matched donors will be notified ✅",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
      background: "#ffffff",
      color: "#171717",
    });

    router.push(
      `/donors?group=${encodeURIComponent(form.blood_group)}&location=${encodeURIComponent(form.location)}`
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="flex items-center justify-center px-4 py-10 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-2xl">
      <h2 className="text-4xl font-bold mb-8 text-center text-slate-900">🚨 Request Blood</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          placeholder="Patient Name"
          className="input"
          value={form.patient}
          onChange={(e) =>
            setForm({ ...form, patient: e.target.value })
          }
          required
        />

        <select
          className="input bg-white text-black"
          value={form.blood_group}
          onChange={(e) =>
            setForm({ ...form, blood_group: e.target.value })
          }
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
          className="input"
          value={form.hospital}
          onChange={(e) =>
            setForm({ ...form, hospital: e.target.value })
          }
          required
        />

        <input
          placeholder="Location"
          className="input"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
          required
        />

        <input
          placeholder="Contact Number"
          className="input"
          value={form.contact}
          onChange={(e) =>
            setForm({ ...form, contact: e.target.value })
          }
          required
        />

        {/* ✅ Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className={`btn transition-all duration-300 ${
            loading || success ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? "Sending..."
            : success
            ? "Request Sent ✅"
            : "🚨 Request Blood"}
        </button>

        {/* ✅ BACK BUTTON AFTER ANY RESULT */}
        {showBack && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => window.location.href = "/"}
              className="btn w-40"
            >
              🏠 Back Home
            </button>
          </div>
        )}

      </form>
        </div>
      </div>
    </main>
  );
}
