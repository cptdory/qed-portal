// api/get-current-user-section-code
import { NextResponse } from "next/server";
import { purchaseRequisitionService } from "@/services/business-central/purchase-requisition.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // console.log(body)
        const {RequestType,CurrentUserName,StartingPoint} = body;
        const result = await purchaseRequisitionService.GetCurrentUserSectionCode(RequestType,CurrentUserName,StartingPoint);
        const parsed = JSON.parse(result?.value || "null");
        // console.log(parsed)
        return NextResponse.json(parsed);
    } catch (err: any) {
        console.error("BC ERROR:", JSON.stringify(err?.response?.data, null, 2));
        return NextResponse.json(
            { error: err?.response?.data?.error?.message || "Failed to get current user section", },
            { status: err?.response?.status || 500 }
        );
    }
}