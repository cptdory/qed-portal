// api/update-issuance-receive
import { NextResponse } from "next/server";
import { purchaseRequisitionService } from "@/services/business-central/purchase-requisition.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Received update issuance receive request with body:", body);
        const {IssuanceNo, IssuanceLineNo, Quantity, RequestType, RequestNo, RequestLineNo} = body;
        const result = await purchaseRequisitionService.UpdateIssuanceReceive(IssuanceNo, IssuanceLineNo, Quantity, RequestType, RequestNo, RequestLineNo);
        const parsed = JSON.parse(result?.value || "null");
        return NextResponse.json(parsed);
    } catch (err: any) {
        console.error("BC ERROR:", JSON.stringify(err?.response?.data, null, 2));
        return NextResponse.json(
            { error: err?.response?.data?.error?.message || "Failed to receive document", },
            { status: err?.response?.status || 500 }
        );
    }
}