import type { NextRequest } from 'next/server'

type Context = { params: Promise<{ path: string[] }> }

async function getHandler(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', request: NextRequest, context: Context) {
  const { auth } = await import('@/lib/auth')
  return auth.handler()[method](request, context)
}

export async function GET(request: NextRequest, context: Context) { return getHandler('GET', request, context) }
export async function POST(request: NextRequest, context: Context) { return getHandler('POST', request, context) }
export async function PUT(request: NextRequest, context: Context) { return getHandler('PUT', request, context) }
export async function PATCH(request: NextRequest, context: Context) { return getHandler('PATCH', request, context) }
export async function DELETE(request: NextRequest, context: Context) { return getHandler('DELETE', request, context) }
