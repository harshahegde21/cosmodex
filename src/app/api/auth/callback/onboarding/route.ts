import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await req.json();

  // save to database

  return NextResponse.json({
    success: true
  });
}