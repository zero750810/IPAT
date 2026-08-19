import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: () => import('../views/HomeView.vue') },
    { path: '/about', component: () => import('../views/AboutView.vue') },
    { path: '/members', component: () => import('../views/MembersView.vue') },
    { path: '/news', component: () => import('../views/NewsView.vue') },
    { path: '/courses', component: () => import('../views/CoursesView.vue') },
    { path: '/contact', component: () => import('../views/ContactView.vue') },
    { path: '/admin/login', component: () => import('../views/admin/LoginView.vue') },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      beforeEnter: () => {
        if (!localStorage.getItem('admin_token')) return '/admin/login'
      },
      children: [
        { path: '', component: () => import('../views/admin/DashboardView.vue') },
        { path: 'news', component: () => import('../views/admin/NewsManage.vue') },
        { path: 'courses', component: () => import('../views/admin/CoursesManage.vue') },
        { path: 'members', component: () => import('../views/admin/MembersManage.vue') },
        { path: 'photo-albums', component: () => import('../views/admin/PhotoAlbumsManage.vue') },
        { path: 'registrations', component: () => import('../views/admin/RegistrationsManage.vue') },
      ],
    },
  ],
})

export default router
