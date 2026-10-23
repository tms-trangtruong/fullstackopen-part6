import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes'
import { useNotification } from './components/NotificationContext'

const App = () => {
  const { anecdotes, isPending, isError, voteAnecdote } = useAnecdotes()
  const { showNotification } = useNotification()

  const handleVote = (anecdote) => {
    voteAnecdote(anecdote)
    showNotification(`you voted for '${anecdote.content}'`)
  }

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
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

export default App
