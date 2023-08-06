<script setup>
import { onMounted, ref } from 'vue'
import { ElNotification } from 'element-plus'
import useTodoStore from '../stores/todos'
import TodosDialog from '../components/todos/dialog.vue'

defineOptions({
  name: 'TodosPage'
})

const store = useTodoStore()
const dialogRef = ref()

onMounted(() => {
  store.fetchTodos()
})

async function handleDelete(todo) {
  try {
    await store.deleteTodo(todo)
    ElNotification.success('Todo was deleted successfully!')
  } catch (e) {
    ElNotification.error('Something went wrong, please try again later!')
  }
}

function handleOpenDialog(todo) {
  dialogRef.value?.open(todo)
}
</script>
<template>
  <el-container>
    <el-aside> <TodosDialog ref="dialogRef" /> </el-aside>
    <el-main>
      <el-row align="middle" justify="space-between">
        <h3>Todos</h3>
        <el-button type="primary" @click="handleOpenDialog()">
          <el-icon><Plus /></el-icon>
          Add
        </el-button>
      </el-row>
      <el-table :data="store.todos">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="completed" label="Completed" />
        <el-table-column prop="actions" label="Actions">
          <template #default="{ row: todo }">
            <el-button type="warning" @click="handleOpenDialog(todo)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" @click="handleDelete(todo)">
              <el-icon><DeleteFilled /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
