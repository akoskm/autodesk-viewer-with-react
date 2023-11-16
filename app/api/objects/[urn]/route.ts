import { getInternalToken } from "@/services";
import { getDataFromApi } from "@/services/fetch_derivative_data";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { urn: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const tokens = await getInternalToken();
    const objects = await getDataFromApi(params.urn, type, tokens);
    return NextResponse.json(objects);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
