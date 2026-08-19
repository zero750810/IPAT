import { Context, Next } from 'hono'
import type { Env } from '../index'

export async function authMiddleware(c: Context<Env>, next: Next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: '未授權' }, 401)
  }

  const token = authHeader.slice(7)
  try {
    const payload = await verifyToken(token, c.env.JWT_SECRET)
    c.set('user' as never, payload)
    await next()
  } catch {
    return c.json({ error: 'Token 無效或已過期' }, 401)
  }
}

export async function createToken(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 }))
  const signature = await sign(`${header}.${body}`, secret)
  return `${header}.${body}.${signature}`
}

async function verifyToken(token: string, secret: string): Promise<Record<string, unknown>> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token')

  const [header, body, signature] = parts
  const expectedSig = await sign(`${header}.${body}`, secret)
  if (signature !== expectedSig) throw new Error('Invalid signature')

  const payload = JSON.parse(atob(body))
  if (payload.exp && payload.exp < Date.now()) throw new Error('Token expired')

  return payload
}

async function sign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
