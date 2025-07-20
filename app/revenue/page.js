"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";

export default function RevenuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState({
    total: 0,
    daily: 0,
    monthly: 0,
    yearly: 0,
  });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user || user.email !== "keluskaratharva999@gmail.com") {
        router.push("/login");
      } else {
        await fetchRevenue();
      }
    });
  }, []);

const fetchRevenue = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const fetchData = async (activity) => {
      try {
        const snap = await getDocs(collection(db, `${activity}_Bookings`));
        if (snap.empty) return []; // return empty array if no documents
        return snap.docs.map((doc) => ({
          id: doc.id,
          activity,
          ...doc.data(),
        }));
      } catch (error) {
        console.error(`Error fetching ${activity} bookings:`, error);
        return [];
      }
    };

    const cricket = await fetchData("Cricket");
    const football = await fetchData("Football");

    const allBookings = [...cricket, ...football]; // now guaranteed to be an array

    let total = 0,
      daily = 0,
      monthly = 0,
      yearly = 0;

    for (const booking of allBookings) {
      const amount = Number(booking.amountPaid || 0);
      const dateStr = booking.date;
      if (!dateStr) continue;

      const date = new Date(dateStr);

      total += amount;
      if (dateStr === today) daily += amount;
      if (date.getMonth() === month && date.getFullYear() === year) monthly += amount;
      if (date.getFullYear() === year) yearly += amount;
    }

    setRevenue({ total, daily, monthly, yearly });
    setBookings(allBookings);
  } catch (err) {
    console.error("Error fetching revenue:", err);
    toast.error("Failed to fetch revenue");
  } finally {
    setLoading(false);
  }
};


  if (loading) return <p className="text-center mt-10">Loading revenue...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Revenue Dashboard
      </h1>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {[
          { label: "Total Revenue", value: revenue.total },
          { label: "Today's Revenue", value: revenue.daily },
          { label: "This Month", value: revenue.monthly },
          { label: "This Year", value: revenue.yearly },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-green-100 border border-green-300 text-green-900 p-6 rounded-lg shadow"
          >
            <p className="text-lg font-semibold">{item.label}</p>
            <p className="text-2xl font-bold mt-2">₹ {item.value}</p>
          </div>
        ))}
      </div>

      {/* Booking Records */}
      <h2 className="text-2xl font-semibold mb-4">All Booking Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow text-sm">
          <thead className="bg-gray-100 border-b text-gray-600 text-left">
            <tr>
              <th className="p-3">Activity</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr
                key={
                  b.id
                    ? `${b.id}-${index}`
                    : `${b.activity}-${b.date}-${b.startTime || index}-${index}`
                }
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">{b.activity}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">
                  {b.startTime || "--"} - {b.endTime || "--"}
                </td>
                <td className="p-3 font-semibold text-green-700">
                  ₹ {b.amountPaid || 0}
                </td>
                <td className="p-3 text-xs">{b.paymentId || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
