import { NextResponse } from "next/server";

export async function middleware(request) {
  const { NEXT_PUBLIC_API_URL } = process.env;

  if (!NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/auth/session`, {
      credentials: "include",
    });

    if (!response.ok) {
      const isUnauthenticatedRoute = ["/login", "/signup"].some((route) =>
        request.nextUrl.pathname.startsWith(route)
      );

      const isAuthenticatedRoute = ["/dashboard", "/profile"].some((route) =>
        request.nextUrl.pathname.startsWith(route)
      );

      if (!response.ok && !isUnauthenticatedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (response.ok && isUnauthenticatedRoute) {
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
