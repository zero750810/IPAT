import { Hono } from 'hono'
import type { Env } from '../index'
import { authMiddleware, createToken } from '../middleware/auth'

export const adminRoutes = new Hono<Env>()

// 登入
adminRoutes.post('/login', async (c) => {
  const { username, password } = await c.req.json<{ username: string; password: string }>()

  if (username !== c.env.ADMIN_USERNAME) {
    return c.json({ error: '帳號或密碼錯誤' }, 401)
  }

  // 驗證密碼（使用 SHA-256 hash 比對）
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  if (hashHex !== c.env.ADMIN_PASSWORD_HASH) {
    return c.json({ error: '帳號或密碼錯誤' }, 401)
  }

  const token = await createToken({ username, role: 'admin' }, c.env.JWT_SECRET)
  return c.json({ token })
})

// 以下所有路由需要驗證
adminRoutes.use('/*', authMiddleware)

// ===== 新聞 CRUD =====
adminRoutes.get('/news', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM news ORDER BY updated_at DESC'
  ).all()
  return c.json(results)
})

adminRoutes.post('/news', async (c) => {
  const body = await c.req.json<{ title: string; content?: string; urls?: string[]; image_url?: string }>()
  if (!body.title) return c.json({ error: '標題為必填' }, 400)

  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  await c.env.DB.prepare(
    'INSERT INTO news (id, title, content, urls, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, body.title, body.content || '', JSON.stringify(body.urls || []), body.image_url || '', now, now).run()

  return c.json({ id }, 201)
})

adminRoutes.put('/news/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ title?: string; content?: string; urls?: string[]; image_url?: string }>()
  const now = new Date().toISOString()

  const existing = await c.env.DB.prepare('SELECT * FROM news WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: '找不到此新聞' }, 404)

  await c.env.DB.prepare(
    'UPDATE news SET title = ?, content = ?, urls = ?, image_url = ?, updated_at = ? WHERE id = ?'
  ).bind(
    body.title ?? existing.title,
    body.content ?? existing.content,
    body.urls ? JSON.stringify(body.urls) : (existing.urls as string),
    body.image_url ?? existing.image_url,
    now,
    id
  ).run()

  return c.json({ message: '更新成功' })
})

adminRoutes.delete('/news/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM news WHERE id = ?').bind(id).run()
  return c.json({ message: '刪除成功' })
})

// ===== 課程 CRUD =====
adminRoutes.get('/courses', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM courses ORDER BY updated_at DESC'
  ).all()
  return c.json(results)
})

adminRoutes.post('/courses', async (c) => {
  const body = await c.req.json<{
    title: string; teacher?: string; location?: string; price?: number
    start_date?: string; end_date?: string; capacity?: number
    active?: boolean; description?: string; urls?: string[]; image_url?: string
  }>()
  if (!body.title) return c.json({ error: '標題為必填' }, 400)

  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  await c.env.DB.prepare(
    `INSERT INTO courses (id, title, teacher, location, price, start_date, end_date, capacity, active, description, urls, image_url, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.title, body.teacher || '', body.location || '', body.price || 0,
    body.start_date || '', body.end_date || '', body.capacity || 0,
    body.active !== false ? 1 : 0, body.description || '', JSON.stringify(body.urls || []), body.image_url || '',
    now, now
  ).run()

  return c.json({ id }, 201)
})

adminRoutes.put('/courses/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{
    title?: string; teacher?: string; location?: string; price?: number
    start_date?: string; end_date?: string; capacity?: number
    active?: boolean; description?: string; urls?: string[]; image_url?: string
  }>()
  const now = new Date().toISOString()

  const existing = await c.env.DB.prepare('SELECT * FROM courses WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: '找不到此課程' }, 404)

  await c.env.DB.prepare(
    `UPDATE courses SET title = ?, teacher = ?, location = ?, price = ?, start_date = ?, end_date = ?,
     capacity = ?, active = ?, description = ?, urls = ?, image_url = ?, updated_at = ? WHERE id = ?`
  ).bind(
    body.title ?? existing.title,
    body.teacher ?? existing.teacher,
    body.location ?? existing.location,
    body.price ?? existing.price,
    body.start_date ?? existing.start_date,
    body.end_date ?? existing.end_date,
    body.capacity ?? existing.capacity,
    body.active !== undefined ? (body.active ? 1 : 0) : existing.active,
    body.description ?? existing.description,
    body.urls ? JSON.stringify(body.urls) : (existing.urls as string),
    body.image_url ?? existing.image_url,
    now, id
  ).run()

  return c.json({ message: '更新成功' })
})

adminRoutes.delete('/courses/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(id).run()
  return c.json({ message: '刪除成功' })
})

// ===== 成員 CRUD =====
adminRoutes.get('/members', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM members ORDER BY sort_order ASC, updated_at DESC'
  ).all()
  return c.json(results)
})

adminRoutes.post('/members', async (c) => {
  const body = await c.req.json<{
    name: string; introduction?: string; tags?: string[]; urls?: string[]
    image_url?: string; sort_order?: number
  }>()
  if (!body.name) return c.json({ error: '姓名為必填' }, 400)

  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  await c.env.DB.prepare(
    'INSERT INTO members (id, name, introduction, tags, urls, image_url, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    id, body.name, body.introduction || '', JSON.stringify(body.tags || []),
    JSON.stringify(body.urls || []), body.image_url || '', body.sort_order || 0, now, now
  ).run()

  return c.json({ id }, 201)
})

adminRoutes.put('/members/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{
    name?: string; introduction?: string; tags?: string[]; urls?: string[]
    image_url?: string; sort_order?: number
  }>()
  const now = new Date().toISOString()

  const existing = await c.env.DB.prepare('SELECT * FROM members WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: '找不到此成員' }, 404)

  await c.env.DB.prepare(
    'UPDATE members SET name = ?, introduction = ?, tags = ?, urls = ?, image_url = ?, sort_order = ?, updated_at = ? WHERE id = ?'
  ).bind(
    body.name ?? existing.name,
    body.introduction ?? existing.introduction,
    body.tags ? JSON.stringify(body.tags) : (existing.tags as string),
    body.urls ? JSON.stringify(body.urls) : (existing.urls as string),
    body.image_url ?? existing.image_url,
    body.sort_order ?? existing.sort_order,
    now, id
  ).run()

  return c.json({ message: '更新成功' })
})

adminRoutes.delete('/members/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM members WHERE id = ?').bind(id).run()
  return c.json({ message: '刪除成功' })
})

// ===== 活動花絮 CRUD =====
adminRoutes.get('/photo-albums', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM photo_albums ORDER BY updated_at DESC'
  ).all()
  return c.json(results)
})

adminRoutes.post('/photo-albums', async (c) => {
  const body = await c.req.json<{ title: string; url?: string; image_url?: string }>()
  if (!body.title) return c.json({ error: '標題為必填' }, 400)

  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  await c.env.DB.prepare(
    'INSERT INTO photo_albums (id, title, url, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, body.title, body.url || '', body.image_url || '', now, now).run()

  return c.json({ id }, 201)
})

adminRoutes.put('/photo-albums/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ title?: string; url?: string; image_url?: string }>()
  const now = new Date().toISOString()

  const existing = await c.env.DB.prepare('SELECT * FROM photo_albums WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ error: '找不到此相簿' }, 404)

  await c.env.DB.prepare(
    'UPDATE photo_albums SET title = ?, url = ?, image_url = ?, updated_at = ? WHERE id = ?'
  ).bind(
    body.title ?? existing.title,
    body.url ?? existing.url,
    body.image_url ?? existing.image_url,
    now, id
  ).run()

  return c.json({ message: '更新成功' })
})

adminRoutes.delete('/photo-albums/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM photo_albums WHERE id = ?').bind(id).run()
  return c.json({ message: '刪除成功' })
})

// ===== 報名管理 =====
adminRoutes.get('/registrations', async (c) => {
  const courseId = c.req.query('course_id')
  let query = `
    SELECT r.*, c.title as course_title
    FROM registrations r
    LEFT JOIN courses c ON r.course_id = c.id
  `
  if (courseId) {
    query += ' WHERE r.course_id = ?'
    const { results } = await c.env.DB.prepare(query + ' ORDER BY r.created_at DESC').bind(courseId).all()
    return c.json(results)
  }

  const { results } = await c.env.DB.prepare(query + ' ORDER BY r.created_at DESC').all()
  return c.json(results)
})

adminRoutes.delete('/registrations/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM registrations WHERE id = ?').bind(id).run()
  return c.json({ message: '刪除成功' })
})

// ===== 圖片上傳 (R2) =====
adminRoutes.post('/upload/:category/:id', async (c) => {
  const category = c.req.param('category')
  const id = c.req.param('id')

  if (!['member', 'news', 'course'].includes(category)) {
    return c.json({ error: '無效的分類' }, 400)
  }

  const formData = await c.req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return c.json({ error: '請提供檔案' }, 400)
  }

  const key = `${category}/${id}.webp`
  await c.env.IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'image/webp' },
  })

  return c.json({ url: `/images/${key}` })
})

// ===== Dashboard 統計 =====
adminRoutes.get('/stats', async (c) => {
  const [news, courses, members, registrations] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as count FROM news').first<{ count: number }>(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM courses').first<{ count: number }>(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM members').first<{ count: number }>(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM registrations').first<{ count: number }>(),
  ])

  return c.json({
    news: news?.count || 0,
    courses: courses?.count || 0,
    members: members?.count || 0,
    registrations: registrations?.count || 0,
  })
})
