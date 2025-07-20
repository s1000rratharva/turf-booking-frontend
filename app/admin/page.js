"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import toast from "react-hot-toast";

export default function AdminPanel() {
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user || user.email !== "keluskaratharva999@gmail.com") {
        router.push("/login");
        return;
      }
      fetchBlockedSlots();
    });
  }, []);

  const fetchBlockedSlots = async () => {
    try {
      const q = query(collection(db, "Blocked_Slots"), orderBy("date"));
      const snap = await getDocs(q);
      const slots = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlockedSlots(slots);
    } catch (err) {
      console.error("Failed to fetch blocked slots", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (id) => {
    try {
      await deleteDoc(doc(db, "Blocked_Slots", id));
      toast.success("Slot unblocked");
      setBlockedSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast.error("Unblock failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading blocked slots...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

      {blockedSlots.length === 0 ? (
        <p className="text-center text-gray-500">No blocked slots found.</p>
      ) : (
        <div className="space-y-4">
          {blockedSlots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white border rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{slot.activity}</p>
                <p>Date: {slot.date}</p>
                <p>Slot: {slot.startTime}</p>
                <p className="text-sm text-gray-500">
                  Blocked by: {slot.blockedBy || "Admin"}
                </p>
              </div>
              <button
                onClick={() => handleUnblock(slot.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
