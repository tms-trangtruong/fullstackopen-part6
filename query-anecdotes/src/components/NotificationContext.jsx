import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState('')

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)

export default NotificationContext
