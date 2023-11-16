import { getInternalToken } from "@/services";
import getObjectTypesFromAPI from "@/services/fetch_object_types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { urn: string } },
) {
  try {
    const tokens = await getInternalToken();
    const objects = await getObjectTypesFromAPI(params.urn, tokens);
    return NextResponse.json(objects);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
