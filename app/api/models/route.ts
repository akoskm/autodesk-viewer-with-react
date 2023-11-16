import { listModels } from "@/services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const objects = await listModels();
    return NextResponse.json(objects);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}

export const dynamic = "force-dynamic";
