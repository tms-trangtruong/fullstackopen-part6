import { useAnecdotes, useAnecdoteActions, useFilter } from "../store"
import anecdotesService from "../services/anecdotes"
import { useNotificationActions } from "../notificationStore"

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter()
  const { vote, remove } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const anecdotesToShow = anecdotes
    .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
    .toSorted((a, b) => b.votes - a.votes)

  const handleVote = async (anecdote) => {
    const changed = { ...anecdote, votes: anecdote.votes + 1 }
    const saved = await anecdotesService.update(changed)
    vote(saved)
    showNotification(`you voted '${saved.content}'`)
  }

  const handleDelete = async (anecdote) => {
    await anecdotesService.remove(anecdote.id)
    remove(anecdote.id)
    showNotification(`you deleted ${anecdote.content}`)
  }

  return (
    <div>
      {anecdotesToShow.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleDelete(anecdote)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
