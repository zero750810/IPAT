<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdmin } from '../../composables/useApi'
import type { Course } from '../../types'

const { getAll, create, update, remove } = useAdmin()

const items = ref<Course[]>([])
const search = ref('')
const showModal = ref(false)
const editingItem = ref<Partial<Course>>({})
const loading = ref(true)

const filteredItems = computed(() => {
  if (!search.value) return items.value
  const q = search.value.toLowerCase()
  return items.value.filter(
    item => item.title.toLowerCase().includes(q) || item.teacher.toLowerCase().includes(q)
  )
})

const fetchData = async () => {
  try {
    items.value = await getAll<Course>('courses')
  } catch (e: any) {
    alert('載入失敗：' + (e.message || '未知錯誤'))
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingItem.value = {
    title: '',
    teacher: '',
    location: '',
    price: 0,
    start_date: '',
    end_date: '',
    capacity: 0,
    active: true,
    description: '',
    image_url: '',
  }
  showModal.value = true
}

const openEdit = (item: Course) => {
  editingItem.value = { ...item }
  showModal.value = true
}

const handleSave = async () => {
  try {
    if (editingItem.value.id) {
      await update<Course>('courses', editingItem.value.id, editingItem.value)
    } else {
      await create<Course>('courses', editingItem.value)
    }
    showModal.value = false
    await fetchData()
  } catch (e: any) {
    alert('儲存失敗：' + (e.message || '未知錯誤'))
  }
}

const handleDelete = async (item: Course) => {
  if (!confirm(`確定要刪除「${item.title}」嗎？`)) return
  try {
    await remove('courses', item.id)
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
      <h2>課程管理</h2>
      <button class="btn btn-primary" @click="openCreate">新增課程</button>
    </div>

    <div class="mb-3">
      <input v-model="search" type="text" class="form-control" placeholder="搜尋標題或講師..." />
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>標題</th>
            <th>講師</th>
            <th>地點</th>
            <th>費用</th>
            <th>狀態</th>
            <th style="width: 150px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.teacher }}</td>
            <td>{{ item.location }}</td>
            <td>{{ item.price }}</td>
            <td>
              <span :class="['badge', item.active ? 'bg-success' : 'bg-secondary']">
                {{ item.active ? '啟用' : '停用' }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(item)">編輯</button>
              <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item)">刪除</button>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0">
            <td colspan="6" class="text-center text-muted py-4">尚無資料</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingItem.id ? '編輯課程' : '新增課程' }}</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <form @submit.prevent="handleSave">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">標題</label>
                  <input v-model="editingItem.title" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">講師</label>
                  <input v-model="editingItem.teacher" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">地點</label>
                  <input v-model="editingItem.location" type="text" class="form-control" required />
                </div>
                <div class="col-md-3">
                  <label class="form-label">費用</label>
                  <input v-model.number="editingItem.price" type="number" class="form-control" required />
                </div>
                <div class="col-md-3">
                  <label class="form-label">人數上限</label>
                  <input v-model.number="editingItem.capacity" type="number" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">開始時間</label>
                  <input v-model="editingItem.start_date" type="datetime-local" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">結束時間</label>
                  <input v-model="editingItem.end_date" type="datetime-local" class="form-control" required />
                </div>
                <div class="col-12">
                  <label class="form-label">說明</label>
                  <textarea v-model="editingItem.description" class="form-control" rows="4"></textarea>
                </div>
                <div class="col-md-9">
                  <label class="form-label">圖片網址</label>
                  <input v-model="editingItem.image_url" type="text" class="form-control" />
                </div>
                <div class="col-md-3 d-flex align-items-end">
                  <div class="form-check">
                    <input v-model="editingItem.active" type="checkbox" class="form-check-input" id="activeCheck" />
                    <label class="form-check-label" for="activeCheck">啟用課程</label>
                  </div>
                </div>
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
