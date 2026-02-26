"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { signInWithEmailHelper, signInWithGoogle } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await signInWithEmailHelper(email, password);
      Swal.fire({ title: "Signed in", icon: "success", timer: 1200, showConfirmButton: false, background: "#111", color: "#fff" });
      router.push("/");
    } catch (err: any) {
      Swal.fire({ title: "Sign in failed", text: err?.message || String(err), icon: "error", background: "#111", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithGoogle();
      Swal.fire({ title: "Signed in with Google", icon: "success", timer: 1200, showConfirmButton: false, background: "#111", color: "#fff" });
      router.push("/");
    } catch (err: any) {
      Swal.fire({ title: "Google Sign-in failed", text: err?.message || String(err), icon: "error", background: "#111", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-md mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6">Login</h2>

      <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
        <input placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className={`btn ${loading ? "opacity-50" : ""}`}>{loading ? "Signing in..." : "Sign in"}</button>
      </form>

      <div className="mt-6 text-center">
        <button onClick={handleGoogle} className="btn">Sign in with Google</button>
      </div>

      <p className="mt-4 text-center">
        Don't have an account? <a href="/register" className="text-red-400 underline">Register</a>
      </p>
    </main>
  );
}
