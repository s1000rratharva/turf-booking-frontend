"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "./components/Footer";


export default function HomePage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Simulate "logged-in" state
  const [isAdmin, setIsAdmin] = useState(false);

  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      return autoplay();
    }
  }, [emblaApi, autoplay]);

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      setLoginError("");
      setIsAdmin(true);
      setShowLoginModal(false);
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const features = [
    {
      icon: "/location.png",
      title: "Prime Location",
      description:
        "Conveniently located turf with great lighting and accessibility.",
    },
    {
      icon: "/appointment.png",
      title: "Quick Booking",
      description: "Pick your date & time. Book in under a minute.",
    },
    {
      icon: "/confirm.png",
      title: "Instant Confirmation",
      description: "Get an email confirmation right after payment.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 transform -skew-y-6 -rotate-6 origin-top-left"></div>
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Book Premium <span className="text-green-600">Turf</span> Fields
                in Minutes
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Find and reserve the best sports turfs in your city. Football,
                cricket, hockey - we have it all with easy online booking.
              </p>
              <Link href="/book">
                <button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition duration-300 transform hover:scale-105">
                  {isAdmin ? "Manage Slots" : "Book Turf Now"}
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose TurfBook?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make turf booking simple, fast, and reliable with our premium
              features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300"
              >
                <Image src={f.icon} alt={f.title} width={48} height={48} className="mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-cyan-500 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Play?
            </h2>
            <p className="text-white text-xl max-w-2xl mx-auto mb-10">
              Join thousands of players who book their turf with us every week
            </p>
            <Link href="/book">
              <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-bold shadow-lg transition duration-300 transform hover:scale-105">
                {isAdmin ? "Manage Slots" : "Book Now"}
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Login to TurfBook
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {loginError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6">
                {loginError}
              </div>
            )}
            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Username"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Password"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
