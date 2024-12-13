import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { adminRoutes, matchesRoute, userRoutes } from "./utils/routing-helpers";


export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    // This will refresh session if expired
    const { data: { user } } = await supabase.auth.getUser();
    const isAuthenticated = user && user?.id
    let userRole = "guest"

    // check if the user is authenticated or not.
    if (isAuthenticated) {
      userRole = "user"
    }
    // check if the user is admin or not.
    if (user?.app_metadata.userlevel >= 500) {
      userRole = "admin"
    }
    const path = request.nextUrl.pathname;

    // Check if the path is an admin route
    if (adminRoutes.some((route) => matchesRoute(path, route))) {
      if (userRole === "admin") {
        return response;
      } else {
        if (isAuthenticated) {
          return NextResponse.redirect(new URL("/todos", request.url));
        } else {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }
    }

    // Check if the path is a user route
    if (userRoutes.some((route) => matchesRoute(path, route))) {
      if (userRole === "admin" || userRole === "user") {
        return response;
      } else {
        if (user && user?.id) {
          return NextResponse.redirect(new URL("/todos", request.url));
        } else {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }
    }

    return response;
  } catch (e) {
    console.error('Error in middleware:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};