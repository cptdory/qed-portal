// api/get-dimension-values
import { NextResponse } from "next/server";
import { purchaseRequisitionService } from "@/services/business-central/purchase-requisition.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {DimensionCode} = body;
        const result = await purchaseRequisitionService.GetDimensionValues(DimensionCode);
        const parsed = JSON.parse(result?.value || "null");
        return NextResponse.json(parsed);
    } catch (err: any) {
        console.error("BC ERROR:", JSON.stringify(err?.response?.data, null, 2));
        return NextResponse.json(
            { error: err?.response?.data?.error?.message || "Failed to get dimension values", },
            { status: err?.response?.status || 500 }
        );
    }
}

