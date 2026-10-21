import { useAnecdotes, useAnecdoteActions, useFilter } from "../store"
import anecdotesService from "../services/anecdotes"

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter()
  const { vote } = useAnecdoteActions()

  const anecdotesToShow = anecdotes
    .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
    .toSorted((a, b) => b.votes - a.votes)

  const handleVote = async (anecdote) => {
    const changed = { ...anecdote, votes: anecdote.votes + 1 }
    const saved = await anecdotesService.update(changed)
    vote(saved)
  }

  return (
    <div>
      {anecdotesToShow.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
