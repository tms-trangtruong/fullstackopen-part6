import { render, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import anecdotesService from './services/anecdotes'
import { useAnecdotes } from './store'

vi.mock('./services/anecdotes', () => ({
  default: { getAll: vi.fn() },
}))

const backendAnecdotes = [
  { id: '1', content: 'Real artists ship code', votes: 7 },
  { id: '2', content: 'Untested code is broken code', votes: 3 },
]

describe('anecdote store', () => {
  it('is initialized with the anecdotes returned by the backend', async () => {
    anecdotesService.getAll.mockResolvedValue(backendAnecdotes)

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([])

    render(<App />)

    await waitFor(() => {
      expect(result.current).toEqual(backendAnecdotes)
    })
    expect(anecdotesService.getAll).toHaveBeenCalledTimes(1)
  })
})
