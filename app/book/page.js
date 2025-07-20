"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";

const SLOT_TIMES = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

export default function BookingPage() {
  const router = useRouter();
  const [activity, setActivity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [blockedSlotDocs, setBlockedSlotDocs] = useState({});
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setIsAdmin(u.email === "keluskaratharva999@gmail.com");
      } else {
        router.push("/login");
      }
    });
  }, []);

  useEffect(() => {
    if (selectedDate && activity) fetchSlots();
  }, [selectedDate, activity]);

  const fetchSlots = async () => {
    try {
      const colRef = collection(db, `${activity}_Bookings`);
      const q = query(colRef, where("date", "==", selectedDate));
      const snapshot = await getDocs(q);
      const booked = snapshot.docs.map((doc) => doc.data().startTime);

      const blockRef = collection(db, "Blocked_Slots");
      const qb = query(
        blockRef,
        where("date", "==", selectedDate),
        where("activity", "==", activity)
      );
      const blockedSnap = await getDocs(qb);
      const blocked = blockedSnap.docs.map((doc) => doc.data().startTime);

      const blockedDocMap = {};
      blockedSnap.docs.forEach((doc) => {
        blockedDocMap[doc.data().startTime] = doc.id;
      });

      setBookedSlots(booked);
      setBlockedSlots(blocked);
      setBlockedSlotDocs(blockedDocMap);
    } catch (err) {
      toast.error("Error fetching slots");
      console.error(err);
    }
  };

  const handleSelectSlot = (slot) => {
    if (bookedSlots.includes(slot) || blockedSlots.includes(slot)) return;
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleProceedToPayment = () => {
    if (!user) return toast.error("Login required");
    if (!selectedSlots.length) return toast.error("No slot selected");

    toast.success("Proceeding to payment...");
    router.push(
      `/payment?activity=${activity}&date=${selectedDate}&slots=${selectedSlots.join(",")}`
    );
  };

  const handleBlockSlots = async () => {
    if (!selectedSlots.length) return toast.error("No slot selected");

    try {
      const blockPromises = selectedSlots.map((slot) =>
        addDoc(collection(db, "Blocked_Slots"), {
          activity,
          date: selectedDate,
          startTime: slot,
          blockedBy: user.email,
          createdAt: new Date(),
        })
      );

      await Promise.all(blockPromises);
      toast.success("Slot(s) marked as unavailable");
      setSelectedSlots([]);
      fetchSlots(); // Refresh
    } catch (err) {
      console.error("Error blocking slot", err);
      toast.error("Failed to block slot");
    }
  };
const handleUnblockSlot = async (slot) => {
  const docId = blockedSlotDocs[slot];
  if (!docId) return;

  try {
    await deleteDoc(doc(db, "Blocked_Slots", docId));
    toast.success(`Slot ${slot} is now available`);
    fetchSlots(); // Refresh the UI
  } catch (err) {
    console.error("Failed to unblock slot", err);
    toast.error("Could not unblock slot");
  }
};


  const getMinDate = () => new Date().toISOString().split("T")[0];
  const getMaxDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 4);
    return d.toISOString().split("T")[0];
  };

 return (
  <div className="p-4 sm:p-6 max-w-6xl mx-auto">
    {/* 1. Choose Activity */}
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">1. Choose an Activity</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        {["Football", "Cricket"].map((type) => (
          <div
            key={type}
            className={`w-full sm:w-60 p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
              activity === type ? "border-green-500 bg-green-50" : ""
            }`}
            onClick={() => setActivity(type)}
          >
            <h2 className="font-semibold text-lg mb-1">
              {type === "Football"
                ? "5v5 Football (Turf)"
                : "5v5 Box Cricket (Turf)"}
            </h2>
            <p className="text-sm text-gray-500">
              1 Facility/Session Available
            </p>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-medium">₹ 1500</span>
              <button className="bg-teal-500 text-white px-3 py-1 rounded text-sm">
                {isAdmin ? "Manage" : "BOOK"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 2. Select Date */}
    {activity && (
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">2. Select Date</h2>
        <input
          type="date"
          className="p-2 border rounded w-full sm:w-auto"
          value={selectedDate}
          min={getMinDate()}
          max={getMaxDate()}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
    )}

    {/* 3. Select Slot */}
    {activity && selectedDate && (
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">3. Select Slot</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {SLOT_TIMES.map((hour) => {
            const time = `${String(hour).padStart(2, "0")}:00`;
            const endHour = hour + 1;
            const slotLabel = `${time} - ${String(endHour).padStart(2, "0")}:00`;

            const isBooked = bookedSlots.includes(time);
            const isBlocked = blockedSlots.includes(time);
            const now = new Date();
            const selected = new Date(`${selectedDate}T${time}`);
            const isPast = selected < now;
            const isSelected = selectedSlots.includes(time);

            if (isBlocked && isAdmin) {
              return (
                <button
                  key={time}
                  onClick={() => handleUnblockSlot(time)}
                  className="text-xs sm:text-sm p-2 sm:p-3 rounded-md font-medium text-center border border-yellow-500 bg-yellow-100 text-yellow-800"
                >
                  {slotLabel}
                  <br />
                  <span className="text-xs font-semibold">Unblock</span>
                </button>
              );
            }

            return (
              <button
                key={time}
                onClick={() => handleSelectSlot(time)}
                disabled={isBooked || isBlocked || isPast}
                className={`text-xs sm:text-sm p-2 sm:p-3 rounded-md font-medium text-center border transition-all ${
                  isBooked || isBlocked || isPast
                    ? "bg-red-200 text-red-700 cursor-not-allowed border-red-400"
                    : isSelected
                    ? "bg-green-200 text-green-800 border-green-400"
                    : "bg-blue-50 hover:bg-blue-100 border-blue-200"
                }`}
              >
                {slotLabel}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {isAdmin ? (
            <button
              onClick={handleBlockSlots}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow"
            >
              Mark Slot(s) as Unavailable
            </button>
          ) : (
            <button
              onClick={handleProceedToPayment}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      </div>
    )}
  </div>
)};