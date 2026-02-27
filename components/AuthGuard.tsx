"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChange } from "@/lib/firebase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChange((user) => {
      if (!user) {
        // allow auth pages to render even when unauthenticated
        if (
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/create-account"
        ) {
          setChecked(true);
          return;
        }
        router.push("/login");
      } else {
        setChecked(true);
      }
    });
    return () => unsub();
  }, [router, pathname]);

  if (!checked) return null;
  return <>{children}</>;
}
