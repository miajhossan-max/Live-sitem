import type { NextRequest } from 'next/server'

type RouteContext = { params: Promise<{ path: string[] }> }
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

async function handleAuth(method: Method, request: NextRequest, context: RouteContext) {
  const { auth } = await import('@/lib/auth')
  const handlers = auth.handler()
  return handlers[method](request, context)
}

export const GET = (request: NextRequest, context: RouteContext) => handleAuth('GET', request, context)
export const POST = (request: NextRequest, context: RouteContext) => handleAuth('POST', request, context)
export const PUT = (request: NextRequest, context: RouteContext) => handleAuth('PUT', request, context)
export const PATCH = (request: NextRequest, context: RouteContext) => handleAuth('PATCH', request, context)
export const DELETE = (request: NextRequest, context: RouteContext) => handleAuth('DELETE', request, context)
