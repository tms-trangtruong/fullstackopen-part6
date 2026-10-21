import { create } from 'zustand'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: (updatedAnecdote) => set((state) => ({
      anecdotes: state.anecdotes.map((a) =>
        a.id === updatedAnecdote.id ? updatedAnecdote : a
      ),
    })),
    add: (anecdote) => set((state) => ({
      anecdotes: state.anecdotes.concat(anecdote),
    })),
    remove: (id) => set((state) => ({
      anecdotes: state.anecdotes.filter((a) => a.id !== id),
    })),
    setFilter: (filter) => set(() => ({ filter })),
    initialize: anecdotes => set(() => ({ anecdotes }))
  },
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
