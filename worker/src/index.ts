import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { newsRoutes } from './routes/news'
import { coursesRoutes } from './routes/courses'
import { membersRoutes } from './routes/members'
import { photoAlbumsRoutes } from './routes/photo-albums'
import { registrationsRoutes } from './routes/registrations'
import { adminRoutes } from './routes/admin'
import { imagesRoutes } from './routes/images'

export type Env = {
  Bindings: {
    DB: D1Database
    IMAGES: R2Bucket
    JWT_SECRET: string
    ADMIN_USERNAME: string
    ADMIN_PASSWORD_HASH: string
    CORS_ORIGIN: string
  }
}

const app = new Hono<Env>()

// CORS
app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.CORS_ORIGIN || '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
  return corsMiddleware(c, next)
})

// Public API
app.route('/api/news', newsRoutes)
app.route('/api/courses', coursesRoutes)
app.route('/api/members', membersRoutes)
app.route('/api/photo-albums', photoAlbumsRoutes)
app.route('/api/registrations', registrationsRoutes)

// Images (R2)
app.route('/images', imagesRoutes)

// Admin API
app.route('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }))

export default app
