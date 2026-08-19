<template>
  <div>
    <!-- 課程須知 -->
    <section class="py-5">
      <div class="container">
        <SectionTitle title="課程須知" />
        <div class="accordion mt-4" id="courseNoticeAccordion">
          <!-- Item 1 -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button collapsed bg-primary text-white"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                課程通知及未開成班通知
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#courseNoticeAccordion"
            >
              <div class="accordion-body">
                <ol>
                  <li>本會課程皆以能開成班為前提，如無特殊狀況，最遲於開課前2至3天於本會網站公告上課時間與地點，不另行電話通知，敬請密切注意本會官網公告。</li>
                  <li>課程如因「未達開班人數」或「其他原因」，而無法開班，將於開課日前2至3天前在本會網站公告，您可選擇辦理保留轉班或退費。</li>
                  <li>本會課程開班訊息及相關資訊，均以本會網站公告為準。</li>
                </ol>
              </div>
            </div>
          </div>
          <!-- Item 2 -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button
                class="accordion-button collapsed bg-primary text-white"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                課程異動通知
              </button>
            </h2>
            <div
              id="collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#courseNoticeAccordion"
            >
              <div class="accordion-body">
                <ol>
                  <li>本會保留調整、修訂課程時間、上課地點及老師之權利，如不得已須異動時，異動資訊將在開課前2至3天公布至本會網站。</li>
                  <li>完成報名手續至上課前，課程資訊若有異動，請密切注意本會官網公告。不另以電話通知。</li>
                </ol>
              </div>
            </div>
          </div>
          <!-- Item 3 -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed bg-primary text-white"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                報名及退費
              </button>
            </h2>
            <div
              id="collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#courseNoticeAccordion"
            >
              <div class="accordion-body">
                <ol>
                  <li>報名時請以ATM轉帳<br>戶名:國際遊戲協會台灣分會<br>銀行代號： 007<br>帳號：17610028630<br>轉帳後請來電告知您的大名及帳號後5碼。</li>
                  <li>開課前二週取消上課退費者，退還已繳費用95%。開課前一週取消上課退費者，退還已繳費用75%。開課前5日內因須於課前備妥材料恕不退費。</li>
                  <li>無論退費原因為何，退費時，本會將扣除應退費總金額2%之ATM轉帳手續費。</li>
                  <li>請學員妥慎保管ATM轉帳繳費明細正本，必要時，憑正本辦理退費。</li>
                </ol>
              </div>
            </div>
          </div>
          <!-- Item 4 -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
              <button
                class="accordion-button collapsed bg-primary text-white"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                其他注意事項
              </button>
            </h2>
            <div
              id="collapseFour"
              class="accordion-collapse collapse"
              aria-labelledby="headingFour"
              data-bs-parent="#courseNoticeAccordion"
            >
              <div class="accordion-body">
                <ol>
                  <li>上課時手機請關靜音，若需接聯電話時請到教室外，避免干擾課程進行。</li>
                  <li>如遇颱風，上課與否，依照電台或電視台播報政府之規定辦理，本會不另行個別通知。</li>
                  <li>本會不設旁聽席，不接受錄影、照相及攜帶寵物上課。</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新課程 -->
    <section class="py-5 bg-light">
      <div class="container">
        <SectionTitle title="最新課程" />
        <LoadingSpinner v-if="loading" />
        <div v-else class="row mt-4">
          <div
            v-for="course in activeCourses"
            :key="course.id"
            class="col-md-3 mb-4"
          >
            <div
              class="card h-100"
              style="cursor: pointer"
              @click="openDetail(course)"
            >
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ course.title }}</h5>
                <p class="card-text mb-1">
                  <strong>講師：</strong>{{ course.teacher }}
                </p>
                <p class="card-text mb-1">
                  <strong>時間：</strong>{{ formatCourseTime(course.start_date, course.end_date) }}
                </p>
                <p class="card-text mb-1">
                  <strong>費用：</strong>NT$ {{ course.price }}
                </p>
                <p v-if="course.capacity > 0" class="card-text mb-1">
                  <strong>名額：</strong>{{ course.capacity }} 人
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 課程詳情 Modal -->
    <div
      v-if="showDetailModal && selectedCourse"
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="showDetailModal = false"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedCourse.title }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="showDetailModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-2">
                <strong>授課教師</strong>
                <p>{{ selectedCourse.teacher }}</p>
              </div>
              <div class="col-md-2">
                <strong>課程費用</strong>
                <p>NT$ {{ selectedCourse.price }}</p>
              </div>
              <div class="col-md-3">
                <strong>上課時間</strong>
                <p>{{ formatCourseTime(selectedCourse.start_date, selectedCourse.end_date) }}</p>
              </div>
              <div class="col-md-3">
                <strong>上課地點</strong>
                <p>{{ selectedCourse.location }}</p>
              </div>
              <div v-if="selectedCourse.capacity > 0" class="col-md-2">
                <strong>課程人數</strong>
                <p>{{ selectedCourse.capacity }} 人</p>
              </div>
            </div>
            <div v-if="selectedCourse.description" class="mb-3">
              <div v-html="selectedCourse.description"></div>
            </div>
            <div v-if="parsedUrls.length > 0" class="mb-3">
              <a
                v-for="(link, idx) in parsedUrls"
                :key="idx"
                :href="link.url"
                target="_blank"
                class="btn btn-sm btn-outline-primary me-2 mb-2"
              >
                {{ link.text }}
              </a>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showDetailModal = false"
            >
              關閉
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="openRegistration"
            >
              報名課程
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDetailModal" class="modal-backdrop fade show"></div>

    <!-- 報名 Modal -->
    <div
      v-if="showRegModal && selectedCourse"
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="showRegModal = false"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">報名：{{ selectedCourse.title }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="showRegModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <input type="hidden" :value="selectedCourse.id" />
              <input type="hidden" :value="selectedCourse.title" />
              <div class="mb-3">
                <label for="regName" class="form-label">姓名</label>
                <input
                  id="regName"
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="regPhone" class="form-label">電話</label>
                <input
                  id="regPhone"
                  v-model="form.phone"
                  type="tel"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="regEmail" class="form-label">聯絡信箱</label>
                <input
                  id="regEmail"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="regParticipants" class="form-label">報名人數</label>
                <input
                  id="regParticipants"
                  v-model.number="form.participants"
                  type="number"
                  min="1"
                  class="form-control"
                  @change="calculateFee"
                />
              </div>
              <div class="mb-3">
                <label for="regFee" class="form-label">費用試算</label>
                <input
                  id="regFee"
                  :value="calculatedFee"
                  type="text"
                  class="form-control"
                  readonly
                />
              </div>
              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="submitting"
              >
                {{ submitting ? '送出中...' : '送出報名' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showRegModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useCourses, submitRegistration } from '../composables/useApi'
import SectionTitle from '../components/SectionTitle.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import type { Course } from '../types'

const { courses, loading, fetchCourses } = useCourses()
const selectedCourse = ref<Course | null>(null)
const showDetailModal = ref(false)
const showRegModal = ref(false)
const submitting = ref(false)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  participants: 1,
})

const activeCourses = computed(() => courses.value.filter((c) => c.active !== 0))

const parsedUrls = computed(() => {
  if (!selectedCourse.value?.urls) return []
  try {
    const arr: string[] = JSON.parse(selectedCourse.value.urls)
    return arr
      .map((item) => {
        const parts = item.split('|||')
        if (parts.length === 2) return { text: parts[0], url: parts[1] }
        return null
      })
      .filter((v): v is { text: string; url: string } => v !== null)
  } catch {
    return []
  }
})

const calculatedFee = computed(() => {
  if (!selectedCourse.value) return 0
  return form.participants * selectedCourse.value.price
})

function formatCourseTime(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const fmtDate = (d: Date) =>
    `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
  const fmtTime = (d: Date) =>
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  if (sameDay) return `${fmtDate(start)} ${fmtTime(start)}~${fmtTime(end)}`
  return `${fmtDate(start)} ${fmtTime(start)}~${fmtDate(end)} ${fmtTime(end)}`
}

function calculateFee() {
  if (form.participants < 1) form.participants = 1
}

function openDetail(course: Course) {
  selectedCourse.value = course
  showDetailModal.value = true
}

function openRegistration() {
  showDetailModal.value = false
  form.name = ''
  form.email = ''
  form.phone = ''
  form.participants = 1
  showRegModal.value = true
}

async function handleSubmit() {
  if (!selectedCourse.value) return
  submitting.value = true
  try {
    await submitRegistration({
      course_id: selectedCourse.value.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      participants: form.participants,
      total_fee: calculatedFee.value,
    })
    alert('報名成功！')
    showRegModal.value = false
  } catch {
    alert('報名失敗，請稍後再試。')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCourses()
})
</script>
