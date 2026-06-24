// api/execute-command
import { NextResponse } from "next/server";
import { purchaseRequisitionService } from "@/services/business-central/purchase-requisition.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body);
        const {CodeunitId, RequestNo} = body;
        const result = await purchaseRequisitionService.ExecuteCommand(CodeunitId, RequestNo);
        const parsed = JSON.parse(result?.value || "null");
        console.log(parsed);
        return NextResponse.json(parsed);
    } catch (err: any) {
        console.error("BC ERROR:", JSON.stringify(err?.response?.data, null, 2));
        return NextResponse.json(
            { error: err?.response?.data?.error?.message || "Failed to execute command", },
            { status: err?.response?.status || 500 }
        );
    }
}