<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdmin } from '../../composables/useApi'
import type { Member } from '../../types'

const { getAll, create, update, remove } = useAdmin()

const items = ref<Member[]>([])
const search = ref('')
const showModal = ref(false)
const editingItem = ref<Partial<Member> & { tagsInput?: string }>({})
const loading = ref(true)

const filteredItems = computed(() => {
  if (!search.value) return items.value
  const q = search.value.toLowerCase()
  return items.value.filter(item => item.name.toLowerCase().includes(q))
})

const parseTags = (tags: string | string[] | undefined): string => {
  if (!tags) return ''
  if (Array.isArray(tags)) return tags.join(', ')
  try {
    const parsed = JSON.parse(tags)
    return Array.isArray(parsed) ? parsed.join(', ') : String(tags)
  } catch {
    return String(tags)
  }
}

const fetchData = async () => {
  try {
    items.value = await getAll<Member>('members')
  } catch (e: any) {
    alert('載入失敗：' + (e.message || '未知錯誤'))
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingItem.value = { name: '', introduction: '', tagsInput: '', sort_order: 0, image_url: '' }
  showModal.value = true
}

const openEdit = (item: Member) => {
  editingItem.value = {
    ...item,
    tagsInput: parseTags(item.tags),
  }
  showModal.value = true
}

const handleSave = async () => {
  try {
    const tagsArray = editingItem.value.tagsInput
      ? editingItem.value.tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean)
      : []
    const data = {
      name: editingItem.value.name,
      introduction: editingItem.value.introduction,
      tags: tagsArray,
      sort_order: editingItem.value.sort_order,
      image_url: editingItem.value.image_url,
    }
    if (editingItem.value.id) {
      await update<Member>('members', editingItem.value.id, data)
    } else {
      await create<Member>('members', data)
    }
    showModal.value = false
    await fetchData()
  } catch (e: any) {
    alert('儲存失敗：' + (e.message || '未知錯誤'))
  }
}

const handleDelete = async (item: Member) => {
  if (!confirm(`確定要刪除「${item.name}」嗎？`)) return
  try {
    await remove('members', item.id)
    await fetchData()
  } catch (e: any) {
    alert('刪除失敗：' + (e.message || '未知錯誤'))
  }
}

onMounted(fetchData)
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>成員管理</h2>
      <button class="btn btn-primary" @click="openCreate">新增成員</button>
    </div>

    <div class="mb-3">
      <input v-model="search" type="text" class="form-control" placeholder="搜尋姓名..." />
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>姓名</th>
            <th>標籤</th>
            <th>排序</th>
            <th style="width: 150px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ parseTags(item.tags) }}</td>
            <td>{{ item.sort_order }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(item)">編輯</button>
              <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item)">刪除</button>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0">
            <td colspan="4" class="text-center text-muted py-4">尚無資料</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingItem.id ? '編輯成員' : '新增成員' }}</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <form @submit.prevent="handleSave">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">姓名</label>
                <input v-model="editingItem.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">介紹</label>
                <textarea v-model="editingItem.introduction" class="form-control" rows="4"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">標籤（以逗號分隔）</label>
                <input v-model="editingItem.tagsInput" type="text" class="form-control" placeholder="例：講師, 顧問, 理事" />
              </div>
              <div class="mb-3">
                <label class="form-label">排序</label>
                <input v-model.number="editingItem.sort_order" type="number" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">圖片網址</label>
                <input v-model="editingItem.image_url" type="text" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showModal = false">取消</button>
              <button type="submit" class="btn btn-primary">儲存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
