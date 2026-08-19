import { ref } from 'vue'
import type { News, Course, Member, PhotoAlbum, Registration, AdminStats } from '../types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

// R2 圖片 URL 生成
export function getImageUrl(category: 'member' | 'news' | 'course', id: string): string {
  return `${API_BASE}/images/${category}/${id}.webp`
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('admin_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '請求失敗' }))
    throw new Error((error as { error: string }).error || `HTTP ${res.status}`)
  }
  return res.json()
}

// Public API
export function useNews() {
  const news = ref<News[]>([])
  const loading = ref(false)

  const fetchNews = async () => {
    loading.value = true
    try {
      news.value = await request<News[]>('/api/news')
    } finally {
      loading.value = false
    }
  }

  return { news, loading, fetchNews }
}

export function useCourses() {
  const courses = ref<Course[]>([])
  const loading = ref(false)

  const fetchCourses = async (activeOnly = false) => {
    loading.value = true
    try {
      const query = activeOnly ? '?active=true' : ''
      courses.value = await request<Course[]>(`/api/courses${query}`)
    } finally {
      loading.value = false
    }
  }

  return { courses, loading, fetchCourses }
}

export function useMembers() {
  const members = ref<Member[]>([])
  const loading = ref(false)

  const fetchMembers = async () => {
    loading.value = true
    try {
      members.value = await request<Member[]>('/api/members')
    } finally {
      loading.value = false
    }
  }

  return { members, loading, fetchMembers }
}

export function usePhotoAlbums() {
  const albums = ref<PhotoAlbum[]>([])
  const loading = ref(false)

  const fetchAlbums = async () => {
    loading.value = true
    try {
      albums.value = await request<PhotoAlbum[]>('/api/photo-albums')
    } finally {
      loading.value = false
    }
  }

  return { albums, loading, fetchAlbums }
}

// Registration
export async function submitRegistration(data: {
  course_id: string
  name: string
  email?: string
  phone?: string
  participants?: number
  total_fee?: number
}) {
  return request<{ id: string; message: string }>('/api/registrations', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Admin API
export function useAdmin() {
  const loading = ref(false)

  const login = async (username: string, password: string) => {
    const { token } = await request<{ token: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    localStorage.setItem('admin_token', token)
    return token
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
  }

  const isLoggedIn = () => !!localStorage.getItem('admin_token')

  const getStats = () => request<AdminStats>('/api/admin/stats')

  // Generic CRUD
  const getAll = <T>(resource: string) => request<T[]>(`/api/admin/${resource}`)

  const create = <T>(resource: string, data: Partial<T>) =>
    request<{ id: string }>(`/api/admin/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

  const update = <T>(resource: string, id: string, data: Partial<T>) =>
    request<{ message: string }>(`/api/admin/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

  const remove = (resource: string, id: string) =>
    request<{ message: string }>(`/api/admin/${resource}/${id}`, {
      method: 'DELETE',
    })

  return { loading, login, logout, isLoggedIn, getStats, getAll, create, update, remove }
}
