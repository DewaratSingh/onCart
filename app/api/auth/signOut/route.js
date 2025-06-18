import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/pages/signIn","http://localhost:3000"));

  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
  });

  return response;
}
