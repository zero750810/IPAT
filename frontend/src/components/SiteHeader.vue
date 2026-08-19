<script setup lang="ts">
import { ref } from 'vue'

const isNavOpen = ref(false)
</script>

<template>
  <header class="site-header py-3">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-auto d-flex align-items-center">
          <RouterLink to="/">
            <img src="/img/logogif.gif" alt="IPAT Logo" class="img-fluid" style="max-width: 80px;">
          </RouterLink>
          <button class="btn d-md-none ms-auto" @click="isNavOpen = !isNavOpen">
            <i class="bi bi-list fs-4"></i>
          </button>
        </div>
        <div class="col" :class="{ 'd-none d-md-block': !isNavOpen }">
          <nav class="d-flex justify-content-center">
            <ul class="nav flex-column flex-md-row">
              <li class="nav-item"><RouterLink class="nav-link" to="/">首頁</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/about">關於我們</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/members">成員介紹</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/news">最新消息</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/courses">課程介紹</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/contact">聯絡我們</RouterLink></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>
