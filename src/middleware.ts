import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/profile", "/chat"];
const authPaths = ["/auth/login", "/auth/register"];
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathName = request.nextUrl.pathname;
  //not login yet
  if (!token && protectedPaths.some((path) => pathName.startsWith(path))) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  //already login
  if (token && authPaths.includes(pathName)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
