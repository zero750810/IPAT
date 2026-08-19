<template>
  <div>
    <!-- Banner -->
    <img src="/img/banner.jpg" class="img-fluid w-100" alt="Banner" />

    <!-- 關於我們 -->
    <section class="py-5">
      <div class="container">
        <SectionTitle title="關於我們" />
        <div class="row align-items-center mt-4">
          <div class="col-md-5">
            <img src="/img/about.jpg" class="img-fluid rounded" alt="關於我們" />
          </div>
          <div class="col-md-7">
            <p>本會為國際遊戲協會在台灣成立的分會，為認同國際遊戲協會之宗旨，在台依法設立、非以營利為目的之社會團體。</p>
            <p>我們的宗旨在促進兒童與家庭各年齡層的健康與教育福祉，以及依照聯合國兒童人權公約致力於保障所有兒童的遊戲權利。</p>
            <p>增強人際互動功能，開展閒暇時間利用和遊戲學習方案，並著力於改善與提供遊戲環境、發展遊具、玩物與遊戲空間，國際遊戲協會台灣分會提供一個國際論壇平台，促進所有兒童、青年直至銀髮樂齡者之遊戲權利與機會。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新消息 -->
    <section class="py-5 bg-light">
      <div class="container">
        <SectionTitle title="最新消息" />
        <LoadingSpinner v-if="newsLoading" />
        <div v-else class="row mt-4">
          <div
            v-for="item in visibleNews"
            :key="item.id"
            class="col-md-4 mb-4"
          >
            <div class="card h-100" role="button" @click="openNewsModal(item)">
              <div class="card-body">
                <h5 class="card-title">{{ item.title }}</h5>
                <p class="card-text">{{ truncate(item.content, 20) }}</p>
              </div>
              <div class="card-footer text-muted">
                {{ formatDate(item.updated_at) }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="newsShowCount < newsList.length" class="text-center mt-3">
          <button class="btn btn-outline-primary" @click="newsShowCount += 6">
            加載更多
          </button>
        </div>
      </div>
    </section>

    <!-- 活動花絮 -->
    <section class="py-5">
      <div class="container">
        <SectionTitle title="活動花絮" />
        <LoadingSpinner v-if="albumsLoading" />
        <div v-else class="row mt-4">
          <div
            v-for="album in visibleAlbums"
            :key="album.id"
            class="col-md-4 mb-4"
          >
            <a :href="album.url" target="_blank" rel="noopener noreferrer" class="text-decoration-none">
              <div class="card h-100" role="button">
                <img
                  v-if="album.image_url"
                  :src="album.image_url"
                  class="card-img-top"
                  :alt="album.title"
                />
                <div class="card-body">
                  <h5 class="card-title">{{ album.title }}</h5>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div v-if="albumsShowCount < albumsList.length" class="text-center mt-3">
          <button class="btn btn-outline-primary" @click="albumsShowCount += 6">
            加載更多
          </button>
        </div>
      </div>
    </section>

    <!-- 最新課程 -->
    <section class="py-5 bg-light">
      <div class="container">
        <SectionTitle title="最新課程" />
        <LoadingSpinner v-if="coursesLoading" />
        <div v-else class="row mt-4">
          <div
            v-for="course in visibleCourses"
            :key="course.id"
            class="col-md-4 mb-4"
          >
            <div
              class="card h-100"
              role="button"
              @click="openCourseModal(course)"
            >
              <div class="card-body">
                <h5 class="card-title">{{ course.title }}</h5>
                <p class="card-text mb-1">
                  <i class="bi bi-person"></i> {{ course.teacher }}
                </p>
                <p class="card-text mb-1">
                  <i class="bi bi-clock"></i> {{ formatCourseTime(course.start_date, course.end_date) }}
                </p>
                <p class="card-text mb-1">
                  <i class="bi bi-currency-dollar"></i> {{ course.price }}
                </p>
                <p class="card-text mb-1">
                  <i class="bi bi-people"></i> {{ course.capacity }} 人
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="coursesShowCount < coursesList.length"
          class="text-center mt-3"
        >
          <button
            class="btn btn-outline-primary"
            @click="coursesShowCount += 6"
          >
            加載更多
          </button>
        </div>
      </div>
    </section>

    <!-- 消息 Modal -->
    <div
      v-if="showNewsModal && selectedNews"
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="showNewsModal = false"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedNews.title }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="showNewsModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p class="text-muted">
              {{ formatDate(selectedNews.updated_at) }}
            </p>
            <div v-html="selectedNews.content"></div>
            <div v-if="parseUrls(selectedNews.urls).length" class="mt-3">
              <a
                v-for="(urlItem, index) in parseUrls(selectedNews.urls)"
                :key="index"
                :href="urlItem.link"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline-primary me-2 mb-2"
              >
                {{ urlItem.text }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showNewsModal" class="modal-backdrop fade show"></div>

    <!-- 課程 Modal -->
    <div
      v-if="showCourseModal && selectedCourse"
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="showCourseModal = false"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedCourse.title }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="showCourseModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p><strong>講師：</strong>{{ selectedCourse.teacher }}</p>
            <p><strong>地點：</strong>{{ selectedCourse.location }}</p>
            <p><strong>費用：</strong>{{ selectedCourse.price }}</p>
            <p><strong>時間：</strong>{{ formatCourseTime(selectedCourse.start_date, selectedCourse.end_date) }}</p>
            <p><strong>人數：</strong>{{ selectedCourse.capacity }} 人</p>
            <div v-if="selectedCourse.description" v-html="selectedCourse.description"></div>
            <div v-if="parseUrls(selectedCourse.urls).length" class="mt-3">
              <a
                v-for="(urlItem, index) in parseUrls(selectedCourse.urls)"
                :key="index"
                :href="urlItem.link"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline-primary me-2 mb-2"
              >
                {{ urlItem.text }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCourseModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNews, useCourses, usePhotoAlbums } from '../composables/useApi'
import SectionTitle from '../components/SectionTitle.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import type { News, Course } from '../types'

const { news: newsList, loading: newsLoading, fetchNews } = useNews()
const { courses: coursesList, loading: coursesLoading, fetchCourses } = useCourses()
const { albums: albumsList, loading: albumsLoading, fetchAlbums } = usePhotoAlbums()

const newsShowCount = ref(6)
const coursesShowCount = ref(6)
const albumsShowCount = ref(6)

const selectedNews = ref<News | null>(null)
const showNewsModal = ref(false)
const selectedCourse = ref<Course | null>(null)
const showCourseModal = ref(false)

const visibleNews = computed(() => newsList.value.slice(0, newsShowCount.value))
const visibleCourses = computed(() => coursesList.value.slice(0, coursesShowCount.value))
const visibleAlbums = computed(() => albumsList.value.slice(0, albumsShowCount.value))

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function truncate(text: string, length: number): string {
  const stripped = text.replace(/<[^>]*>/g, '')
  return stripped.length > length ? stripped.slice(0, length) + '...' : stripped
}

function formatCourseTime(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const sYear = start.getFullYear()
  const sMonth = start.getMonth() + 1
  const sDay = start.getDate()
  const sHour = String(start.getHours()).padStart(2, '0')
  const sMin = String(start.getMinutes()).padStart(2, '0')

  const eYear = end.getFullYear()
  const eMonth = end.getMonth() + 1
  const eDay = end.getDate()
  const eHour = String(end.getHours()).padStart(2, '0')
  const eMin = String(end.getMinutes()).padStart(2, '0')

  if (sYear === eYear && sMonth === eMonth && sDay === eDay) {
    return `${sYear}/${sMonth}/${sDay} ${sHour}:${sMin}~${eHour}:${eMin}`
  }
  return `${sYear}/${sMonth}/${sDay} ${sHour}:${sMin}~${eYear}/${eMonth}/${eDay} ${eHour}:${eMin}`
}

function parseUrls(urlsStr: string): Array<{ text: string; link: string }> {
  if (!urlsStr) return []
  try {
    const arr = JSON.parse(urlsStr) as string[]
    return arr
      .map((item) => {
        const [text, link] = item.split('|||')
        return text && link ? { text, link } : null
      })
      .filter((item): item is { text: string; link: string } => item !== null)
  } catch {
    return []
  }
}

function openNewsModal(item: News) {
  selectedNews.value = item
  showNewsModal.value = true
}

function openCourseModal(course: Course) {
  selectedCourse.value = course
  showCourseModal.value = true
}

onMounted(() => {
  fetchNews()
  fetchCourses()
  fetchAlbums()
})
</script>
