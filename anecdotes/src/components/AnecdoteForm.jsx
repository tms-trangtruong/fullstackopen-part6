import { useAnecdoteActions } from "../store"
import anecdotesService from "../services/anecdotes"
import { useNotificationActions } from "../notificationStore"

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ""
    const newAnecdote = await anecdotesService.createNew(content)
    add(newAnecdote)
    showNotification(`you created '${newAnecdote.content}'`)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
