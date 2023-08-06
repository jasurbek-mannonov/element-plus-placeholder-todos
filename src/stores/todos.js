import http from '../utils/http'
import { defineStore } from 'pinia'

const useTodoStore = defineStore('todos', {
  state: () => ({
    todos: []
  }),
  actions: {
    async fetchTodos() {
      try {
        const { data } = await http.get('/todos')
        this.todos = data
        return data
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async createTodo(todo) {
      try {
        const { data } = await http.post('todos', todo)
        this.fetchTodos()
        return data
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async updateTodo(todo) {
      try {
        const { data } = await http.put(`todos/${todo.id}`, todo)
        const index = this.todos.findIndex((u) => u.id === todo.id)
        if (index === -1) return

        this.todos.splice(index, 1, { ...todo })
        return data
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async deleteTodo(todo) {
      try {
        await http.delete(`/todos/${todo.id}`)

        const index = this.todos.findIndex((u) => u.id === todo.id)
        if (index === -1) return
        this.todos.splice(index, 1)
        return todo
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }
})

export default useTodoStore
