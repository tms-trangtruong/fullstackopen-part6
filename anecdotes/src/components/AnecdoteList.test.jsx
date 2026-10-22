import { act, cleanup, render, renderHook, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import AnecdoteList from './AnecdoteList'
import { useAnecdoteActions } from '../store'

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

describe('<AnecdoteList />', () => {
  let actions

  afterEach(cleanup)

  beforeEach(() => {
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
})
