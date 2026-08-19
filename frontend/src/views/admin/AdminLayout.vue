<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAdmin } from '../../composables/useApi'

const router = useRouter()
const { logout } = useAdmin()

const handleLogout = () => {
  logout()
  router.push('/admin/login')
}

const navItems = [
  { label: '儀表板', path: '/admin', icon: 'bi-speedometer2' },
  { label: '新聞管理', path: '/admin/news', icon: 'bi-newspaper' },
  { label: '課程管理', path: '/admin/courses', icon: 'bi-book' },
  { label: '成員管理', path: '/admin/members', icon: 'bi-people' },
  { label: '活動花絮', path: '/admin/photo-albums', icon: 'bi-images' },
  { label: '報名管理', path: '/admin/registrations', icon: 'bi-clipboard-check' },
]
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <nav class="navbar navbar-dark bg-dark px-3">
      <span class="navbar-brand mb-0 h1">IPAT 後台管理</span>
      <button class="btn btn-outline-light btn-sm" @click="handleLogout">登出</button>
    </nav>
    <div class="d-flex flex-grow-1 overflow-hidden">
      <div class="admin-sidebar bg-light border-end p-3" style="width: 220px; min-width: 220px; overflow-y: auto">
        <ul class="nav flex-column">
          <li v-for="item in navItems" :key="item.path" class="nav-item">
            <RouterLink :to="item.path" class="nav-link text-dark">
              <i :class="['bi', item.icon, 'me-2']"></i>{{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
      <div class="flex-grow-1 p-4 overflow-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>
