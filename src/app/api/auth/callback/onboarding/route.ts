import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const _body = await req.json();

  // save to database

  return NextResponse.json({
    success: true
  });
}