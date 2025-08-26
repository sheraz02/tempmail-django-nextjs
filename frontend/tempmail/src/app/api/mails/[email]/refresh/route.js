import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { email } =await context.params;

  try {
    const res = await fetch(
      `${process.env.DJANGO_API_URL}/api/inbox/${email}/refresh/`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
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
