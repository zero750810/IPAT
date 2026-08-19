export interface News {
  id: string
  title: string
  content: string
  urls: string // JSON array string, format: ["text|||link", ...]
  image_url: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  teacher: string
  location: string
  price: number
  start_date: string
  end_date: string
  capacity: number
  active: number
  description: string
  urls: string // JSON array string
  image_url: string
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  name: string
  introduction: string
  tags: string // JSON array string
  urls: string // JSON array string, format: ["text|||link", ...]
  image_url: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PhotoAlbum {
  id: string
  title: string
  url: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface Registration {
  id: string
  course_id: string
  course_title?: string
  name: string
  email: string
  phone: string
  participants: number
  total_fee: number
  created_at: string
}

export interface AdminStats {
  news: number
  courses: number
  members: number
  registrations: number
}
