// api/create-request-line
import { NextResponse } from "next/server";
import { purchaseRequisitionService } from "@/services/business-central/purchase-requisition.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { RequestNo,
            Type,
            No,
            Quantity,
            WarehouseLocation,
            Dim1,
            Dim2,
            Dim3,
            Dim4,
            Dim5,
            Dim6,
            Dim7,
            Dim8, } = body;
        const result = await purchaseRequisitionService.CreateRequestLine(RequestNo,
            Type,
            No,
            Quantity,
            WarehouseLocation,
            Dim1,
            Dim2,
            Dim3,
            Dim4,
            Dim5,
            Dim6,
            Dim7,
            Dim8,);
        const parsed = JSON.parse(result?.value || "null");
        return NextResponse.json(parsed);
    } catch (err: any) {
        console.error("BC ERROR:", JSON.stringify(err?.response?.data, null, 2));
        return NextResponse.json(
            { error: err?.response?.data?.error?.message || "Failed to create request line", },
            { status: err?.response?.status || 500 }
        );
    }
}

