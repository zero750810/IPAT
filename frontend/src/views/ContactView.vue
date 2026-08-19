<template>
  <div>
    <!-- 聯絡我們 -->
    <section class="py-5">
      <div class="container">
        <SectionTitle title="聯絡我們" />
        <div class="row mt-4">
          <div class="col-md-6 mb-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3616.0419704588435!2d121.53707637564005!3d24.99868977783928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442aa02e180f64b%3A0xa88c3a7435352ccc!2zMTE25Y-w5YyX5biC5paH5bGx5Y2A5pmv56aP6KGXM-W3tzIx6Jmf!5e0!3m2!1szh-TW!2stw!4v1748835678828!5m2!1szh-TW!2stw"
              width="100%"
              height="400"
              style="border: 0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div class="col-md-6">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="contactName" class="form-label">姓名</label>
                <input
                  id="contactName"
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="contactEmail" class="form-label">Email</label>
                <input
                  id="contactEmail"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="contactSubject" class="form-label">主旨</label>
                <input
                  id="contactSubject"
                  v-model="form.subject"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="contactMessage" class="form-label">訊息內容</label>
                <textarea
                  id="contactMessage"
                  v-model="form.message"
                  class="form-control"
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary w-100">
                送出訊息
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import SectionTitle from '../components/SectionTitle.vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

function handleSubmit() {
  alert('感謝您的來信，我們將盡快回覆！')
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
}
</script>
