// api/get-new-item-request
import { NextResponse } from "next/server";
import { purchaseRequisitionService } from "@/services/business-central/purchase-requisition.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { NewItemRequestNo} = body;
        const result = await purchaseRequisitionService.GetNewItemRequest( NewItemRequestNo);
        const parsed = JSON.parse(result?.value || "null");
        return NextResponse.json(parsed);
    } catch (err: any) {
        console.error("BC ERROR:", JSON.stringify(err?.response?.data, null, 2));
        return NextResponse.json(
            { error: err?.response?.data?.error?.message || "Failed to get item request", },
            { status: err?.response?.status || 500 }
        );
    }
}

