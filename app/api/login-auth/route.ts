// api/login-auth
import { NextResponse } from "next/server";
import { purchaseRequisitionService } from "@/services/business-central/purchase-requisition.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { EmailAddress } = body;

    const result = await purchaseRequisitionService.LoginAuth(EmailAddress);
    const parsed = JSON.parse(result?.value || "null");
    console.log(parsed)

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("BC ERROR:", JSON.stringify(err?.response?.data, null, 2));
    return NextResponse.json(
      { error: err?.response?.data?.error?.message || "Login failed" },
      { status: err?.response?.status || 500 }
    );
  }
}