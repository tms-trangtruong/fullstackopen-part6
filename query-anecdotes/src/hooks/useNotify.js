import { useContext } from 'react'
import NotificationContext from '../components/NotificationContext'

// Returns a function that shows a notification for 5 seconds
export const useNotify = () => {
  const { showNotification } = useContext(NotificationContext)
  return showNotification
}

// Returns the current notification message
export const useNotificationValue = () => {
  const { notification } = useContext(NotificationContext)
  return notification
}
