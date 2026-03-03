"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChange } from "@/lib/firebase";

export default function Home() {
  const [welcomeName, setWelcomeName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChange((user) => {
      if (!user) {
        setWelcomeName("");
        return;
      }
      const fromDisplayName = (user.displayName || "").trim();
      const fromEmail = (user.email || "").split("@")[0];
      setWelcomeName(fromDisplayName || fromEmail || "");
    });
    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-20">
        <div className="w-full max-w-2xl text-center animate-fade-in">
  {welcomeName && (
    <p className="mb-3 text-base font-semibold text-red-600">Welcome, {welcomeName}</p>
  )}

  {/* Blood Character */}
  <div
    className="mb-6 animate-slide-up flex justify-center"
    style={{ animationDelay: "0.1s" }}
  >
    <img
      src="/blood.png"
      alt="Blood Drop"
      className="w-20 md:w-24 object-contain drop-shadow-lg"
    />
  </div>

  {/* Heading */}
  <h1
    className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight animate-slide-up"
    style={{ animationDelay: "0.2s" }}
  >
    Save Lives.{" "}
    <span className="text-red-600">Donate Blood</span>
  </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed animate-slide-up"
             style={{ animationDelay: "0.3s" }}>
            Every donation makes a difference. Join thousands of donors helping those in need.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
               style={{ animationDelay: "0.4s" }}>
            <Link
              href="/register"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Register as Donor
            </Link>

            <Link
              href="/request"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Request Blood
            </Link>
          </div>

        </div>
      </section>
{/* Gallery Section */}
<section className="py-20 bg-white">
  <div className="max-w-6xl mx-auto px-6">

    <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
      ❤️ Our Donor Community
    </h2>

    <p className="text-slate-600 text-center mb-12">
      Real heroes. Real lives saved.
    </p>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {["g1.jpg","g2.jpg","g3.jpg","g4.jpg","g5.jpg","g6.jpg"].map((img) => (
        <div
          key={img}
          className="gallery-card cursor-pointer"
          onClick={() => setSelectedImage(img)}
        >
          <img src={`/${img}`} className="gallery-img" />
        </div>
      ))}
    </div>
  </div>
</section>
{selectedImage && (
  <div className="lightbox" onClick={() => setSelectedImage(null)}>
    <img
      src={`/${selectedImage}`}
      className="lightbox-img"
    />
  </div>
)}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;      }
          to {
            opacity: 1;
          }
        }
          /* ✅ Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fade-in 0.3s ease;
}
.lightbox-img {
  max-width: 90%;
  max-height: 85%;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(0,0,0,0.4);
  animation: zoom-in 0.3s ease;
}

@keyframes zoom-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
