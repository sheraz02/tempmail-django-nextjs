import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { email } = await context.params;

  try {
    // Call Django backend internally
    const res = await fetch(`${process.env.DJANGO_API_URL}/api/inbox/${email}/`, {
      headers: {
        "Content-Type": "application/json",
        // Optionally add auth headers if needed
        // Authorization: `Bearer ${process.env.DJANGO_API_KEY}`
      },
      cache: "no-store", // prevent caching
    });

    if (!res.ok) {
      throw new Error(`Django API error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
