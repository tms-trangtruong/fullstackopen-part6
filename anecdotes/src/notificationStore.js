import { create } from 'zustand'

let timeoutId

const useNotificationStore = create((set) => ({
  message: '',
  actions: {
    showNotification: (message, seconds = 5) => {
      clearTimeout(timeoutId)
      set(() => ({ message }))
      timeoutId = setTimeout(() => set(() => ({ message: '' })), seconds * 1000)
    },
  },
}))

export const useNotification = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)
