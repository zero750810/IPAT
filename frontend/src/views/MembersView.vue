<template>
  <div>
    <!-- 成員列表 -->
    <section class="py-5">
      <div class="container">
        <SectionTitle title="成員介紹" />
        <LoadingSpinner v-if="loading" />
        <div v-else class="row mt-4">
          <div
            v-for="member in sortedMembers"
            :key="member.id"
            class="col-md-12 mb-4"
          >
            <div class="card member-card">
              <div class="row g-0">
                <div class="col-md-1"></div>
                <div class="col-md-3">
                  <img
                    v-show="!imageErrors.has(member.id)"
                    :src="getImageUrl('member', member.id)"
                    class="img-fluid rounded-start"
                    :alt="member.name"
                    @error="onImageError(member.id)"
                  />
                </div>
                <div class="col-md-7">
                  <div class="card-body">
                    <h5>{{ member.name }} - {{ parseTags(member.tags).join('、') }}</h5>
                    <p v-html="member.introduction"></p>
                    <div v-if="parseUrls(member.urls).length">
                      <a
                        v-for="(urlItem, index) in parseUrls(member.urls)"
                        :key="index"
                        :href="urlItem.link"
                        class="btn btn-outline-primary me-2 mb-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {{ urlItem.text }}
                      </a>
                    </div>
                  </div>
                </div>
                <div class="col-md-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMembers, getImageUrl } from '../composables/useApi'
import type { Member } from '../types'
import SectionTitle from '../components/SectionTitle.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const { members, loading, fetchMembers } = useMembers()
const imageErrors = ref<Set<string>>(new Set())

const positionPriority: Record<string, number> = {
  '理事長': 1,
  '副理事長': 2,
  '秘書長': 3,
  '顧問': 4,
  '常務監事': 5,
  '常務理事': 6,
  '理事': 7,
  '監事': 8,
  '會員': 9,
}

function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags)
  } catch {
    return []
  }
}

function parseUrls(urls: string): { text: string; link: string }[] {
  try {
    const parsed: string[] = JSON.parse(urls)
    return parsed
      .map((item) => {
        const [text, link] = item.split('|||')
        return text && link ? { text, link } : null
      })
      .filter((item): item is { text: string; link: string } => item !== null)
  } catch {
    return []
  }
}

function getMemberPriority(member: Member): number {
  const tags = parseTags(member.tags)
  let minPriority = 99
  for (const tag of tags) {
    const priority = positionPriority[tag]
    if (priority !== undefined && priority < minPriority) {
      minPriority = priority
    }
  }
  return minPriority
}

const sortedMembers = computed(() => {
  return [...members.value].sort((a, b) => getMemberPriority(a) - getMemberPriority(b))
})

function onImageError(id: string) {
  imageErrors.value.add(id)
  imageErrors.value = new Set(imageErrors.value)
}

onMounted(() => {
  fetchMembers()
})
</script>
