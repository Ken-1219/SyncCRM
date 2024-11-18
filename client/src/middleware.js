import { NextResponse } from "next/server";

export async function middleware(request) {
  const { NEXT_PUBLIC_API_URL } = process.env;

  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/auth/session`, {
      headers: {
        cookie: request.headers.get("cookie"),
      },
      credentials: "include",
    });

    if (!response.ok) {
      const unauthenticatedRoutes = ["/login", "/signup"];
      if (
        !unauthenticatedRoutes.some((route) =>
          request.nextUrl.pathname.startsWith(route)
        )
      ) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } else {
      const authenticatedRoutes = ["/login", "/signup"];
      if (
        authenticatedRoutes.some((route) =>
          request.nextUrl.pathname.startsWith(route)
        )
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  } catch (error) {
    console.error("Error in middleware:", error);

    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/protected/:path*",
    "/login",
    "/signup",
  ],
};
