"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChange, signOutUser } from "@/lib/firebase";

export default function ResponsiveHeader() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const hideAuthActions = ["/signup", "/register", "/request", "/login", "/create-account"].includes(pathname);
  const hideMenu = [
    "/signup",
    "/register",
    "/request",
    "/login",
    "/create-account",
    "/donors",
    "/about",
    "/FAQ",
    "/contact",
  ].includes(pathname);
  const showTopLinks = ["/", "/about", "/FAQ", "/contact"].includes(pathname);

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
      router.push("/signup");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {!hideMenu && user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-gray-700 transition hover:bg-gray-100"
                  aria-label="Open menu"
                >
                  <span className="flex flex-col gap-1">
                    <span className="h-0.5 w-4 bg-gray-700" />
                    <span className="h-0.5 w-4 bg-gray-700" />
                    <span className="h-0.5 w-4 bg-gray-700" />
                  </span>
                </button>
              </div>
            )}

            <Link
              href="/"
              className="flex items-center gap-2 whitespace-nowrap text-xl font-bold leading-none text-red-600 sm:text-2xl"
            >
              Blood Connect
            </Link>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            {showTopLinks && (
              <>
                <Link href="/" className="text-red-400 transition-colors duration-200 hover:text-red-700">
                  Home
                </Link>
                <Link href="/about" className="text-red-400 transition-colors duration-200 hover:text-red-700">
                  About
                </Link>
                <Link href="/FAQ" className="text-red-400 transition-colors duration-200 hover:text-red-700">
                  FAQ
                </Link>
                <Link href="/contact" className="text-red-400 transition-colors duration-200 hover:text-red-700">
                  Contact
                </Link>
              </>
            )}
            {!hideAuthActions && !user && (
              <Link href="/signup" className="btn text-sm">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </header>

      {!hideMenu && user && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
              menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className={`fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-out ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="border-b border-gray-100 px-4 py-4">
              <Link
                href="/"
                className="text-lg font-bold text-red-600"
                onClick={() => setMenuOpen(false)}
              >
                Blood Connect
              </Link>
            </div>

            <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-4 py-4">
              <p className="font-semibold text-red-700">Menu</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded border border-red-200 bg-white px-2 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                X
              </button>
            </div>

            <div className="border-b border-gray-100 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold tracking-wide text-gray-500">Signed in as</p>
              <p className="truncate text-sm font-bold text-gray-800">{user?.email}</p>
            </div>

            <nav className="py-2">
              {showTopLinks && (
                <>
                  <Link
                    href="/"
                    className="mx-2 mb-1 block rounded-md px-3 py-3 text-sm font-semibold text-gray-800 transition hover:bg-red-50 hover:text-red-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="mx-2 mb-1 block rounded-md px-3 py-3 text-sm font-semibold text-gray-800 transition hover:bg-red-50 hover:text-red-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/FAQ"
                    className="mx-2 mb-1 block rounded-md px-3 py-3 text-sm font-semibold text-gray-800 transition hover:bg-red-50 hover:text-red-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/contact"
                    className="mx-2 mb-1 block rounded-md px-3 py-3 text-sm font-semibold text-gray-800 transition hover:bg-red-50 hover:text-red-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </>
              )}
              <Link
                href="/dashboard"
                className="mx-2 mb-1 block rounded-md px-3 py-3 text-sm font-semibold text-gray-800 transition hover:bg-red-50 hover:text-red-700"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="mx-2 block w-[calc(100%-1rem)] rounded-md px-3 py-3 text-left text-sm font-semibold text-gray-800 transition hover:bg-red-50 hover:text-red-700"
              >
                Sign out
              </button>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
