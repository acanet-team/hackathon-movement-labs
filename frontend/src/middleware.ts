import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ONBOARDING_STEP } from "./api/auth/auth.model";

export async function middleware(request: NextRequest) {
  const token = (await getToken({
    req: request,
    // secret: process.env.NEXT_AUTH_SECRET,
    secret: "Vsmn1iPTxPak0x3q2+HHSI23ZLX+rZMAoQylm5Uyoew=",
  })) as any;

  console.log("trace =>>>>>>>>", token);

  if (!token || token.needToLogin) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }
  if (token.user.onboarding_data?.step !== ONBOARDING_STEP.COMPLETE) {
    return NextResponse.redirect(
      new URL("/onboarding", request.nextUrl.origin),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/communities"],
};
