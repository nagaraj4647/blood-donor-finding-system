"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChange, signOutUser } from "@/lib/firebase";

export default function Header() {
  const [user, setUser] = useState<any>(null);
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
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <div className="font-bold">Blood Donor App</div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span>{user.email}</span>
            <button onClick={handleSignOut} className="btn">Sign out</button>
          </div>
        ) : (
          <button onClick={() => router.push('/login')} className="btn">Sign in</button>
        )}
      </div>
    </header>
  );
}
