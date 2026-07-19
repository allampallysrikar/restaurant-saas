import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email === "admin@xyz.com" && password === "admin123") {
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'admin_session',
      value: 'authenticated',
      path: '/',
      httpOnly: true,
      maxAge: 86400, // 24 hours
    });
    return response;
  }

  return NextResponse.json(
    { success: false, error: 'Invalid credentials' },
    { status: 401 }
  );
}
