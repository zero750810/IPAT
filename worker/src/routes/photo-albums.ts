import { Hono } from 'hono'
import type { Env } from '../index'

export const photoAlbumsRoutes = new Hono<Env>()

// 取得所有活動花絮
photoAlbumsRoutes.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM photo_albums ORDER BY updated_at DESC'
  ).all()
  return c.json(results)
})
