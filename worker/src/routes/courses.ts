import { Hono } from 'hono'
import type { Env } from '../index'

export const coursesRoutes = new Hono<Env>()

// 取得所有課程
coursesRoutes.get('/', async (c) => {
  const activeOnly = c.req.query('active')
  let query = 'SELECT * FROM courses'
  if (activeOnly === 'true') {
    query += ' WHERE active = 1'
  }
  query += ' ORDER BY updated_at DESC'

  const { results } = await c.env.DB.prepare(query).all()
  return c.json(results)
})

// 取得單一課程
coursesRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  const result = await c.env.DB.prepare(
    'SELECT * FROM courses WHERE id = ?'
  ).bind(id).first()

  if (!result) return c.json({ error: '找不到此課程' }, 404)
  return c.json(result)
})
