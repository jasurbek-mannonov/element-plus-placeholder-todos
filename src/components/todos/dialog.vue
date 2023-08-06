<script setup>
import { ref, computed } from 'vue'
import { ElNotification } from 'element-plus'
import useTodoStore from '../../stores/todos'

import { Check, Close } from '@element-plus/icons-vue'

defineOptions({
  name: 'TodosDialog'
})

const defaultTodo = {
  title: '',
  completed: true
}

const drawer = ref(false)
const formRef = ref()
const store = useTodoStore()
const todo = ref({ ...defaultTodo })

function open(u) {
  drawer.value = true
  if (!u) {
    // yangi todo create
    todo.value = { ...defaultTodo }
  } else {
    //{} edit qilish
    todo.value = { ...u }
  }
}

function handleClose() {
  formRef.value.resetFields()
  drawer.value = false
}

async function handleUpdate() {
  await store.updateTodo(todo.value)
  ElNotification.success('Todo was edited successfully!')
}

async function handleSave() {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    if (todo.value.id) {
      await handleUpdate()
    } else {
      await handleCreate()
    }

    handleClose()
  } catch (e) {
    ElNotification.error('Something went wrong, please, try again later!')
  }
}

const rules = ref({
  title: [{ required: true }],
  completed: [{ required: true }]
})

const drawerTitle = computed(() => {
  return todo.value.id ? 'Edit Todo' : 'Create Todo'
})

defineExpose({
  open
})
</script>

<template>
  <el-drawer v-model="drawer" :title="drawerTitle" :before-close="handleClose">
    <el-form label-position="top" :rules="rules" :model="todo" ref="formRef">
      <el-form-item label="Title" prop="title">
        <el-input v-model="todo.title" />
      </el-form-item>
      <el-form-item label="Completed" prop="completed">
        <el-switch
          v-model="todo.completed"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-button type="success" @click="handleSave">
        <el-icon><Select /></el-icon>
        Save
      </el-button>
      <el-button type="danger" @click="handleClose">
        <el-icon><Close /></el-icon>
        Cancel
      </el-button>
    </el-form>
  </el-drawer>
</template>
