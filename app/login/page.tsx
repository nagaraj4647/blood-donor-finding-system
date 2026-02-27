"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { signInWithEmailHelper, signInWithGoogle } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await signInWithEmailHelper(email, password);
      Swal.fire({
        title: "Signed in",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
        background: "#111",
        color: "#fff",
      });
      router.push("/");
    } catch (err: any) {
      Swal.fire({
        title: "Sign in failed",
        text: err?.message || String(err),
        icon: "error",
        background: "#111",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await signInWithGoogle();
      Swal.fire({
        title: "Signed in with Google",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
        background: "#111",
        color: "#fff",
      });
      router.push("/");
    } catch (err: any) {
      const rawMessage = err?.message || String(err);
      const isUnauthorizedDomain =
        rawMessage.includes("auth/unauthorized-domain") ||
        rawMessage.includes("unauthorized-domain");

      Swal.fire({
        title: "Google Sign-in failed",
        text: isUnauthorizedDomain
          ? "This domain is not authorized in Firebase. Add this host in Firebase Auth > Settings > Authorized domains."
          : rawMessage,
        icon: "error",
        background: "#111",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef0f3] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-8 shadow-md text-black">
        <h2 className="mb-6 text-center text-4xl font-bold text-red-600">Login</h2>

        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-red-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleGoogle}
            className="w-full rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Sign in with Google
          </button>
        </div>

        <p className="mt-5 text-center text-slate-700">
          Don't have an account?{" "}
          <Link href="/create-account" className="font-semibold text-red-600 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
