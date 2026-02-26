"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChange, signOutUser } from "@/lib/firebase";
import Link from "next/link";

export default function ResponsiveHeader() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChange((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setMenuOpen(false);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Hamburger Menu Button - Top Left */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-3xl text-gray-700 hover:text-red-600 transition"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Site Title (Right side) */}
        <Link href="/" className="text-lg font-bold text-red-600 flex items-center gap-2">
          🩸 Blood Connect
        </Link>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <nav className="bg-white border-t border-gray-200">
          <div className="flex flex-col p-4 gap-3 max-w-xs">
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-red-600 transition py-2 font-medium">
              Home
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-red-600 transition py-2 font-medium">
              About
            </Link>
            <Link href="/FAQ" onClick={() => setMenuOpen(false)} className="hover:text-red-600 transition py-2 font-medium">
              FAQ
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-red-600 transition py-2 font-medium">
              Contact
            </Link>
            <hr className="my-2" />
            
            {user ? (
              <>
                <div className="py-2">
                  <p className="text-sm text-gray-600 mb-1">Logged in as:</p>
                  <p className="font-semibold text-slate-900 truncate">{user.email}</p>
                </div>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn text-sm w-full text-center">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="btn text-sm w-full text-center"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn text-sm w-full text-center">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm w-full text-center">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

