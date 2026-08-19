import { Hono } from 'hono'
import type { Env } from '../index'

export const membersRoutes = new Hono<Env>()

// 取得所有成員
membersRoutes.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM members ORDER BY sort_order ASC, updated_at DESC'
  ).all()
  return c.json(results)
})

// 取得單一成員
membersRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  const result = await c.env.DB.prepare(
    'SELECT * FROM members WHERE id = ?'
  ).bind(id).first()

  if (!result) return c.json({ error: '找不到此成員' }, 404)
  return c.json(result)
})
