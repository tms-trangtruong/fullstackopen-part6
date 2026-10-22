import { act, cleanup, fireEvent, render, renderHook, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AnecdoteList from './AnecdoteList'
import anecdotesService from '../services/anecdotes'
import { useAnecdoteActions } from '../store'

// The backend echoes back the anecdote it was asked to save.
vi.mock('../services/anecdotes', () => ({
  default: { update: vi.fn(async (anecdote) => anecdote), remove: vi.fn() },
}))

// Deliberately not sorted by votes, so the test proves the list does the sorting.
const storeAnecdotes = [
  { id: '1', content: 'Make it work, then make it fast', votes: 0 },
  { id: '2', content: 'Real artists ship code', votes: 7 },
  { id: '3', content: 'Untested code is broken code', votes: 3 },
  { id: '4', content: 'Simplicity is the ultimate sophistication', votes: 5 },
]

const allContents = storeAnecdotes.map((a) => a.content)

// Contents of the anecdotes AnecdoteList actually rendered, in display order.
const displayedContents = () =>
  screen
    .queryAllByText((_, element) => allContents.includes(element.textContent) && element.children.length === 0)
    .map((element) => element.textContent)

// The block wrapping one anecdote's content and its "has N votes / vote" row.
const anecdoteItem = (content) => screen.getByText(content, { exact: true }).parentElement

describe('<AnecdoteList />', () => {
  let actions

  afterEach(cleanup)

  beforeEach(() => {
    vi.clearAllMocks()
    actions = renderHook(() => useAnecdoteActions()).result.current
    act(() => {
      actions.initialize(storeAnecdotes)
      actions.setFilter('')
    })
  })

  it('displays the anecdotes from the store sorted by votes', () => {
    render(<AnecdoteList />)

    const expectedOrder = [...storeAnecdotes]
      .sort((a, b) => b.votes - a.votes)
      .map((a) => a.content)

    expect(displayedContents()).toEqual(expectedOrder)
  })

  it('displays only the anecdotes matching the filter', () => {
    act(() => actions.setFilter('CODE'))

    render(<AnecdoteList />)

    // Case-insensitive match, still sorted by votes.
    expect(displayedContents()).toEqual([
      'Real artists ship code',
      'Untested code is broken code',
    ])
  })

  it('voting increases the number of votes for an anecdote', async () => {
    const voted = storeAnecdotes.find((a) => a.content === 'Untested code is broken code')
    const unaffected = 'Simplicity is the ultimate sophistication'

    render(<AnecdoteList />)
    expect(anecdoteItem(voted.content).textContent).toContain('has 3')

    fireEvent.click(within(anecdoteItem(voted.content)).getByRole('button', { name: 'vote' }))

    await waitFor(() => {
      expect(anecdoteItem(voted.content).textContent).toContain('has 4')
    })
    expect(anecdotesService.update).toHaveBeenCalledWith({ ...voted, votes: 4 })
    expect(anecdoteItem(unaffected).textContent).toContain('has 5')
  })
})
