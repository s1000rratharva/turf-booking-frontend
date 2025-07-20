"use client";

import { auth } from "@/app/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react"; // You can use Heroicons or any other icon too

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAdmin(user?.email === "keluskaratharva999@gmail.com");
    });
    return () => unsub();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-lg px-4 py-3 rounded-b-2xl sticky top-0 z-50 border border-gray-100">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-lg shadow-md"
            />
            <span className="text-xl font-bold text-green-700">GreenSpot Turf</span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-green-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-6 items-center text-green-700 font-semibold">
          {!isAdmin && (
            <a href="#location" className="hover:text-green-600 transition">
              Location
            </a>
          )}

          {!isAdmin && (
            <Link href="/book" className="hover:text-green-600 transition">
              Book a Slot
            </Link>
          )}

          {!isAdmin && user && (
            <Link href="/your-booking" className="hover:text-green-600 transition">
              Your Bookings
            </Link>
          )}

          {isAdmin && (
            <>
              <Link href="/admin" className="hover:text-blue-700 transition">
                Admin Panel
              </Link>
              <Link href="/revenue" className="hover:text-green-600">
                Revenue
              </Link>
              <Link href="/book" className="hover:text-blue-700 transition">
                Manage Slots
              </Link>
            </>
          )}

          {!user ? (
            <Link href="/login">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition">
                Login
              </button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 space-y-4 text-green-700 font-semibold flex flex-col">
          {!isAdmin && (
            <a href="#location" className="hover:text-green-600 transition">
              Location
            </a>
          )}

          {!isAdmin && (
            <Link href="/book" className="hover:text-green-600 transition">
              Book a Slot
            </Link>
          )}

          {!isAdmin && user && (
            <Link href="/your-booking" className="hover:text-green-600 transition">
              Your Bookings
            </Link>
          )}

          {isAdmin && (
            <>
              <Link href="/admin" className="hover:text-blue-700 transition">
                Admin Panel
              </Link>
              <Link href="/revenue" className="hover:text-green-600">
                Revenue
              </Link>
              <Link href="/book" className="hover:text-blue-700 transition">
                Manage Slots
              </Link>
            </>
          )}

          {!user ? (
            <Link href="/login">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition">
                Login
              </button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
