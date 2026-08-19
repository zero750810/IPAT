<script setup lang="ts">
</script>

<template>
  <footer class="site-footer text-white py-4 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-4 mb-3 mb-md-0 text-center text-md-start">
          <img src="/img/logo-150x150.jpeg" alt="IPAT Logo" class="img-fluid mb-2" style="max-width: 100px;">
          <p class="small">International Play Association Taiwan Branch<br>國際遊戲協會台灣分會</p>
        </div>
        <div class="col-md-4 mb-3 mb-md-0">
          <h6>聯絡資訊</h6>
          <p class="small mb-1">
            <i class="bi bi-geo-alt-fill me-1"></i>116台北市文山區景福街3巷21號
          </p>
          <p class="small mb-0">
            <i class="bi bi-envelope-fill me-1"></i>
            <a href="mailto:ipat1080224@gmail.com" class="text-white text-decoration-none">ipat1080224@gmail.com</a>
          </p>
        </div>
        <div class="col-md-4 text-center text-md-end">
          <h6>社群媒體</h6>
          <div class="d-flex justify-content-center justify-content-md-end gap-3 fs-4">
            <a href="https://www.facebook.com/IPAT-International-Play-Association-Taiwan-Branch-106772071551600" target="_blank" class="text-white">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="https://line.me/R/ti/g/QErEEYyMhK" target="_blank" class="text-white">
              <i class="bi bi-line"></i>
            </a>
            <a href="https://twitter.com/ipataiwan1" target="_blank" class="text-white">
              <i class="bi bi-twitter-x"></i>
            </a>
            <a href="https://www.instagram.com/ipataiwan/" target="_blank" class="text-white">
              <i class="bi bi-instagram"></i>
            </a>
            <RouterLink to="/admin" class="text-white" style="opacity: 0;">
              <i class="bi bi-gear"></i>
            </RouterLink>
          </div>
        </div>
      </div>
      <hr class="my-3">
      <p class="text-center small mb-0">&copy; Copyright 2025. 網頁設計 By Zero.Lin</p>
    </div>
  </footer>
</template>
