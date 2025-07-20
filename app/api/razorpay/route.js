// app/api/razorpay/route.js

export async function POST(request) {
  try {
    const body = await request.json();
    const amount = body.amount;

    const backendUrl = "https://your-backend.onrender.com/create-order"; // <-- replace with your backend URL

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: res.status,
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create order" }),
      { status: 500 }
    );
  }
}
