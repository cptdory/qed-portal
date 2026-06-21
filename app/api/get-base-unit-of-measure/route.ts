// api/get-base-unit-of-measure
import { NextResponse } from "next/server";
import { purchaseRequisitionService } from "@/services/business-central/purchase-requisition.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const result = await purchaseRequisitionService.GetBaseUnitOfMeasure();
        const parsed = JSON.parse(result?.value);

        return NextResponse.json(parsed ?? [], {
            headers: {  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.response?.data?.error?.message || "Failed to fetch base unit of measure", },
            { status: err?.response?.status || 500, headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate", }, }
        );
    }
}
