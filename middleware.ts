import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Define your role hierarchy and protected paths
const ROLE_ROUTES = {
  '/super-admin': ['super_admin'],
  '/learning-admin': ['super_admin', 'learning_admin'],
  '/arena-admin': ['super_admin', 'arena_admin'],
  '/dashboard': ['student', 'super_admin', 'learning_admin', 'arena_admin'],
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() is critical: it validates the token with the Supabase Auth server.
  // Do NOT use getSession() for authorization, as it only checks the local, potentially spoofed cookie.
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. Unauthenticated users hitting protected routes
  const isProtectedRoute = Object.keys(ROLE_ROUTES).some(route => path.startsWith(route))
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', path) // Store intent for post-login redirection
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Authenticated users hitting auth routes (login/signup)
  if (user && (path.startsWith('/login') || path.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. RBAC Enforcement
  if (user && isProtectedRoute) {
    const userRole = user.app_metadata?.role || 'student'
    
    // Find the matching route rule
    const matchingRoute = Object.keys(ROLE_ROUTES).find(route => path.startsWith(route))
    
    if (matchingRoute) {
      const allowedRoles = ROLE_ROUTES[matchingRoute as keyof typeof ROLE_ROUTES]
      
      if (!allowedRoles.includes(userRole)) {
        // Log this attempt in your observability tool (Datadog/Sentry) as it implies unauthorized exploration
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}