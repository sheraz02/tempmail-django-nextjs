// app/api/generate-email/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Call Django backend internally
    const res = await fetch(`${process.env.DJANGO_API_URL}/api/generate-email/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // If auth token is required, you can inject here securely
        // "Authorization": `Bearer ${process.env.DJANGO_API_KEY}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch from Django");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
