/**
 * Middleware function that creates a Supabase client and retrieves the user's session.
 * Whenever the cookie is expired, the middleware will create a new one, so so the user doesn't have to log in again.
 * @param req - The Next.js request object.
 * @returns The Next.js response object.
 */
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  await supabase.auth.getSession()
  return res
}
