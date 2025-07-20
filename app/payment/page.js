"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  collection,
  addDoc,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../firebase";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activity, setActivity] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [pricePerHour, setPricePerHour] = useState(1500);
  const totalAmount = pricePerHour * slots.length;
  const db = getFirestore();

  useEffect(() => {
    const activityParam = searchParams.get("activity") || "";
    const dateParam = searchParams.get("date") || "";
    const slotString = searchParams.get("slots") || "";
    const slotArray = slotString.split(",").filter(Boolean);

    setActivity(activityParam);
    setDate(dateParam);
    setSlots(slotArray);
  }, [searchParams]);

  const getEndTime = (slot) => {
    const [hour] = slot.split(":").map(Number);
    if (isNaN(hour)) return "--:--";
    return `${String(hour + 1).padStart(2, "0")}:00`;
  };

  const handlePayment = async () => {
    const resScript = await loadRazorpayScript();
    if (!resScript) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    try {
      toast.loading("Creating Razorpay Order...");

      const res = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const data = await res.json();
      toast.dismiss();

      if (!data.id) throw new Error("Razorpay order creation failed");

      const rzp = new window.Razorpay({
        key:
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_hD5vT64kNs5EFN",
        amount: totalAmount * 100,
        currency: "INR",
        name: "SuperKick Turf",
        description: `Booking for ${activity}`,
        order_id: data.id,
        handler: async (response) => {
          try {
            const user = auth.currentUser;
            const paymentId = response.razorpay_payment_id;
            const orderId = response.razorpay_order_id;

            if (!paymentId || !orderId) {
              throw new Error("Invalid payment response");
            }

            const activityCollection =
              activity.toLowerCase() === "football"
                ? "Football_Bookings"
                : "Cricket_Bookings";

            for (const slot of slots) {
              const [hour] = slot.split(":").map(Number);
              const endTime = `${String(hour + 1).padStart(2, "0")}:00`;

              await addDoc(collection(db, activityCollection), {
                userId: user.uid,
                userEmail: user.email,
                date,
                startTime: slot,
                endTime,
                paymentId,
                orderId,
                amountPaid: pricePerHour,
                timestamp: serverTimestamp(),
              });
            }

            // Send email after successful storage
            await fetch("/api/send-confirmation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: user?.email,
                activity,
                date,
                startTime: slots[0],
                endTime: `${String(Number(slots[slots.length - 1].split(":")[0]) + 1).padStart(2, "0")}:00`,
              }),
            });

            toast.success("Booking Successful!");
            router.push("/your-booking");
          } catch (err) {
            console.error("Booking save failed:", err);
            toast.error("Payment done, but failed to save booking.");
          }
        },
        prefill: {
          email: auth.currentUser?.email || "",
        },
        theme: {
          color: "#22c55e",
        },
        method: {
          netbanking: true,
          upi: true,
          card: false,
          wallet: false,
          emi: false,
          paylater: false,
        },
      });

      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      toast.dismiss();
      toast.error("Something went wrong during payment.");
    }
  };

  if (!activity || !date || !slots.length) {
    return (
      <p className="text-center text-gray-500 mt-12">
        Loading booking summary...
      </p>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gradient-to-br from-gray-100 to-white min-h-screen">
      <div className="bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Payment Summary
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="text-lg">
              <span className="font-semibold">Activity:</span> {activity}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Date:</span> {date}
            </p>
            <p className="text-lg font-semibold">Slot(s):</p>
            <ul className="list-disc list-inside mt-1">
              {slots.map((slot, idx) => (
                <li key={idx}>
                  {slot} - {getEndTime(slot)}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <p className="text-lg">
              <span className="font-semibold">Price per Hour:</span> ₹
              {pricePerHour}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Total Duration:</span>{" "}
              {slots.length} hour(s)
            </p>
            <p className="text-xl font-bold mt-4 text-green-700">
              Total Amount: ₹{totalAmount}
            </p>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3 rounded-xl shadow-lg transition"
        >
          Proceed to Pay ₹{totalAmount}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
