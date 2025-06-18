import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request= NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = ["/pages/user/profile"].includes(pathname);
  const isAuthPage = ["/signIn", "/signUp"].includes(pathname);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/pages/signIn", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/pages/user/:path*","/api/user/like/:path*","/api/user/cart/:path*","/pages/admin/:path*", "/signUp"],
};
