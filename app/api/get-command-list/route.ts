// api/get-command-list
import { NextResponse } from "next/server";
import { purchaseRequisitionService } from "@/services/business-central/purchase-requisition.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        //  console.log(body)
        const {RequestNo,SectionCode, CurrentUserName} = body;
        const result = await purchaseRequisitionService.GetCommandList(RequestNo,SectionCode, CurrentUserName);
        const parsed = JSON.parse(result?.value || "null");
        //  console.log(parsed)
        return NextResponse.json(parsed);
    } catch (err: any) {
        console.error("BC ERROR:", JSON.stringify(err?.response?.data, null, 2));
        return NextResponse.json(
            { error: err?.response?.data?.error?.message || "Failed to get commands", },
            { status: err?.response?.status || 500 }
        );
    }
}