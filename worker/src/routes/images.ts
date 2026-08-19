import { Hono } from 'hono'
import type { Env } from '../index'

export const imagesRoutes = new Hono<Env>()

// GET /images/:category/:id.webp — 從 R2 讀取圖片
// category: member, news, course
imagesRoutes.get('/:category/:filename', async (c) => {
  const category = c.req.param('category')
  const filename = c.req.param('filename')
  const key = `${category}/${filename}`

  const object = await c.env.IMAGES.get(key)
  if (!object) {
    return c.notFound()
  }

  const headers = new Headers()
  headers.set('Content-Type', object.httpMetadata?.contentType || 'image/webp')
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  object.writeHttpMetadata(headers)

  return new Response(object.body, { headers })
})
