import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let isAuthenticated = true

export function middleware(req: NextRequest) {
    // check if request is for /user page
    if (req.nextUrl.pathname.startsWith('/user')) {
        if (!isAuthenticated) {
            // redirect to login page if not authenticated
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }

    // allow request
    return NextResponse.next()
}

// Apply middleware only to /user route
export const config = {
    matcher: ['/user/:path*'],
}
