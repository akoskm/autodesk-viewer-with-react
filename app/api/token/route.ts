import { getPublicToken } from "@/services";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const tokens = await getPublicToken();

  return NextResponse.json(tokens);
}

export const dynamic = "force-dynamic";
