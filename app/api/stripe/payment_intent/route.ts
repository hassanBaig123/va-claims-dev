export const dynamic = "force-dynamic"; // defaults to auto
import { getHourlyTimestamp } from "@/utils/stripe/helper.client";
import { fetchAllPaymentIntentList } from "@/utils/stripe/helper.server";
import { NextResponse } from "next/server";

export async function GET() {
  const getData = await fetchAllPaymentIntentList(getHourlyTimestamp(8));
  return NextResponse.json(getData);
}
