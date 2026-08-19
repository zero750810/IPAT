<template>
  <div>
    <!-- 最新消息 -->
    <section class="py-5">
      <div class="container">
        <SectionTitle title="最新消息" />
        <LoadingSpinner v-if="loading" />
        <div v-else class="row row-cols-1 row-cols-md-3 g-4 mt-2">
          <div
            v-for="item in newsList"
            :key="item.id"
            class="col"
          >
            <div class="card h-100" role="button" @click="openModal(item)">
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
      </div>
    </section>

    <!-- Modal -->
    <div
      v-if="showModal && selectedItem"
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="showModal = false"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedItem.title }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="showModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p class="text-muted">
              {{ formatDate(selectedItem.updated_at) }}
            </p>
            <div v-html="selectedItem.content"></div>
            <div v-if="parseUrls(selectedItem.urls).length" class="mt-3">
              <a
                v-for="(urlItem, index) in parseUrls(selectedItem.urls)"
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
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNews } from '../composables/useApi'
import SectionTitle from '../components/SectionTitle.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import type { News } from '../types'

const { news: newsList, loading, fetchNews } = useNews()
const selectedItem = ref<News | null>(null)
const showModal = ref(false)

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

function openModal(item: News) {
  selectedItem.value = item
  showModal.value = true
}

onMounted(() => {
  fetchNews()
})
</script>
