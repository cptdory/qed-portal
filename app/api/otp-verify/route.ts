import { NextResponse } from "next/server";
import { purchaseRequisitionService } from "@/services/business-central/purchase-requisition.service";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { EmailAddress, OTP } = body;

    const result = await purchaseRequisitionService.VerifyOTP(EmailAddress, OTP);
    const parsed = JSON.parse(result?.value || "null");

    if (!parsed || parsed.Status !== "Successful") {
      return NextResponse.json(
        { error: parsed?.Message || "Invalid or expired code." },
        { status: 401 }
      );
    }

    // Call LoginAuth to get full user data including role
    const loginAuthRes = await fetch(`${process.env.NEXTAUTH_URL}/api/login-auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ EmailAddress }),
    });
    const loginAuthData = await loginAuthRes.json().catch(() => ({}));

    const sessionData = {
      user: {
        UserId: parsed.UserId,
        Email: parsed.Email,
        Role: loginAuthData.Role || "Portal User",
      },
    };
    const token = await createSession(sessionData);

    const res = NextResponse.json({
      success: true,
      user: sessionData.user,
    });

    res.cookies.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    console.error("BC ERROR:", JSON.stringify(err?.response?.data, null, 2));
    return NextResponse.json(
      { error: err?.response?.data?.error?.message || "Failed to verify code" },
      { status: err?.response?.status || 500 }
    );
  }
}