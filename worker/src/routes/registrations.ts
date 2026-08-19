import { Hono } from 'hono'
import type { Env } from '../index'

export const registrationsRoutes = new Hono<Env>()

// 課程報名
registrationsRoutes.post('/', async (c) => {
  const body = await c.req.json<{
    course_id: string
    name: string
    email?: string
    phone?: string
    participants?: number
    total_fee?: number
  }>()

  if (!body.course_id || !body.name) {
    return c.json({ error: '課程 ID 和姓名為必填' }, 400)
  }

  // 檢查課程是否存在且開放
  const course = await c.env.DB.prepare(
    'SELECT id, capacity FROM courses WHERE id = ? AND active = 1'
  ).bind(body.course_id).first<{ id: string; capacity: number }>()

  if (!course) {
    return c.json({ error: '課程不存在或已關閉' }, 404)
  }

  // 檢查是否已額滿
  if (course.capacity > 0) {
    const count = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM registrations WHERE course_id = ?'
    ).bind(body.course_id).first<{ count: number }>()

    if (count && count.count >= course.capacity) {
      return c.json({ error: '課程已額滿' }, 400)
    }
  }

  const id = crypto.randomUUID()
  await c.env.DB.prepare(
    'INSERT INTO registrations (id, course_id, name, email, phone, participants, total_fee) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, body.course_id, body.name, body.email || '', body.phone || '', body.participants || 1, body.total_fee || 0).run()

  return c.json({ id, message: '報名成功' }, 201)
})
