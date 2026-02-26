"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/lib/firebase";
import Swal from "sweetalert2";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      Swal.fire({
        title: "Password Mismatch",
        text: "Passwords do not match",
        icon: "error",
        background: "#ffffff",
        color: "#171717",
        confirmButtonColor: "#e11d48",
      });
      return;
    }

    if (form.password.length < 6) {
      Swal.fire({
        title: "Weak Password",
        text: "Password must be at least 6 characters",
        icon: "error",
        background: "#ffffff",
        color: "#171717",
        confirmButtonColor: "#e11d48",
      });
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(form.email, form.password);
      
      Swal.fire({
        title: "Account Created ✅",
        text: "Now complete your donor profile",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#ffffff",
        color: "#171717",
      });

      // Redirect to donor registration with email pre-filled
      router.push(`/register?email=${encodeURIComponent(form.email)}&username=${encodeURIComponent(form.username)}`);
    } catch (err: any) {
      Swal.fire({
        title: "Signup Failed",
        text: err?.message || String(err),
        icon: "error",
        background: "#ffffff",
        color: "#171717",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="flex items-center justify-center px-4 py-20 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold mb-2 text-center text-slate-900">Create Account</h2>
          <p className="text-center text-gray-600 mb-8">Step 1: Account Details</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              placeholder="Username"
              className="input"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />

            <input
              placeholder="Email"
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="input"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`btn w-full ${loading ? "opacity-50" : ""}`}
            >
              {loading ? "Creating Account..." : "Next: Add Donor Profile"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account? <a href="/login" className="text-red-600 font-semibold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </main>
  );
}
