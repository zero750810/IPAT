import { Hono } from 'hono'
import type { Env } from '../index'

export const newsRoutes = new Hono<Env>()

// 取得所有新聞
newsRoutes.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM news ORDER BY updated_at DESC'
  ).all()
  return c.json(results)
})

// 取得單一新聞
newsRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  const result = await c.env.DB.prepare(
    'SELECT * FROM news WHERE id = ?'
  ).bind(id).first()

  if (!result) return c.json({ error: '找不到此新聞' }, 404)
  return c.json(result)
})
