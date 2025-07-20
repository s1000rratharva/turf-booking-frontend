"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase"; // ✅ make sure db = getFirestore(app)
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const YourBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const cricketRef = collection(db, "Cricket_Bookings");
        const footballRef = collection(db, "Football_Bookings");

        const cricketQuery = query(cricketRef, where("userId", "==", user.uid));
        const footballQuery = query(footballRef, where("userId", "==", user.uid));

        const [cricketSnap, footballSnap] = await Promise.all([
          getDocs(cricketQuery),
          getDocs(footballQuery),
        ]);

        const cricketBookings = cricketSnap.docs.map((doc) => ({
          id: doc.id,
          activity: "Cricket",
          ...doc.data(),
        }));

        const footballBookings = footballSnap.docs.map((doc) => ({
          id: doc.id,
          activity: "Football",
          ...doc.data(),
        }));

        const allBookings = [...cricketBookings, ...footballBookings].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.startTime}`);
          const dateB = new Date(`${b.date}T${b.startTime}`);
          return dateA - dateB;
        });

        setBookings(allBookings);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load bookings", err);
        toast.error("Failed to fetch bookings");
      }
    });
  }, []);

  if (loading) {
    return <p className="text-center mt-12 text-gray-500">Loading your bookings...</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center mt-12 text-gray-600">No bookings found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Your Bookings</h1>

      <div className="space-y-4">
        {bookings.map((booking) => {
          const isPast =
            new Date(`${booking.date}T${booking.endTime}`) < new Date();

          return (
            <div
              key={booking.id}
              className={`p-4 rounded-lg border shadow-sm ${
                isPast
                  ? "bg-red-100 border-red-300 text-red-800"
                  : "bg-green-100 border-green-300 text-green-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{booking.activity}</p>
                  <p>Date: {booking.date}</p>
                  <p>
                    Slot: {booking.startTime} - {booking.endTime}
                  </p>
                  <p>Payment ID: {booking.paymentId}</p>
                </div>
                <span className="text-sm font-medium uppercase">
                  {isPast ? "Completed" : "Upcoming"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YourBookingsPage;
