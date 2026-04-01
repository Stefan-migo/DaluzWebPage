import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require authentication
const protectedRoutes = [
  "/perfil",
  "/mis-tesoros",
  "/mis-pedidos",
  "/mi-membresia",
  "/mis-favoritos",
  "/checkout",
];

// Routes that require admin role
const adminRoutes = ["/admin"];

// Routes that are only for unauthenticated users (login, register, etc)
const authRoutes = ["/login", "/register", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Create Supabase client to verify session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Create a response to modify
  let response = NextResponse.next();

  // Create Supabase server client with cookie handling
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Get session - this will also refresh the token if needed
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const isAuthenticated = !!session && !error;

  // Debug log in development
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[Auth Middleware] Path: ${pathname}, Auth: ${isAuthenticated}, Error: ${error?.message}`,
    );
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes require special handling
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add security headers to all responses
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // HSTS header only in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (except protected ones)
     * - marketing pages (public)
     * - blog content (public)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/(?!admin|checkout)|blog|servicios|alkimya|membresia).*)",
  ],
};
