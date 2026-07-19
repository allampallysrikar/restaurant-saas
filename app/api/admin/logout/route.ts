import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  const response = NextResponse.redirect(new URL("/login", baseUrl));
  response.cookies.delete("admin_session");
  return response;
}
