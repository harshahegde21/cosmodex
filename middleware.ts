import { NextResponse, type NextRequest } from 'next/server'

// Define your role hierarchy and protected paths
const ROLE_ROUTES = {
  '/super-admin': ['super_admin'],
  '/learning-admin': ['super_admin', 'learning_admin'],
  '/arena-admin': ['super_admin', 'arena_admin'],
  '/dashboard': ['student', 'super_admin', 'learning_admin', 'arena_admin'],
}

const SESSION_COOKIE = 'cosmo_session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Retrieve custom session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE)
  let user = null
  if (sessionCookie?.value) {
    try {
      user = JSON.parse(sessionCookie.value)
    } catch {
      // Ignored: invalid JSON
    }
  }

  // 1. Unauthenticated users hitting protected routes
  const isProtectedRoute = Object.keys(ROLE_ROUTES).some(route => path.startsWith(route))
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL('/onboarding', request.url)
    redirectUrl.searchParams.set('mode', 'login') // Go straight to login form
    redirectUrl.searchParams.set('next', path)    // Store intent for post-login redirection
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Authenticated users hitting auth/onboarding routes
  if (user && (path.startsWith('/login') || path.startsWith('/signup') || (path.startsWith('/onboarding') && request.nextUrl.searchParams.get('mode') === 'login'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. RBAC Enforcement
  if (user && isProtectedRoute) {
    const userRole = user.role || 'student'
    
    // Find the matching route rule
    const matchingRoute = Object.keys(ROLE_ROUTES).find(route => path.startsWith(route))
    
    if (matchingRoute) {
      const allowedRoles = ROLE_ROUTES[matchingRoute as keyof typeof ROLE_ROUTES]
      
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}