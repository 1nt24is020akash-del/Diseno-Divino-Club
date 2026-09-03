import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'diseno-divino-read-notifications'

const readIds = (userId) => {
  try {
    const stored = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-${userId}`) || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export default function NotificationBell({ notifications, userId, onSelect }) {
  const [open, setOpen] = useState(false)
  const [readNotificationIds, setReadNotificationIds] = useState(() => userId ? readIds(userId) : [])

  useEffect(() => {
    if (userId) localStorage.setItem(`${STORAGE_KEY}-${userId}`, JSON.stringify(readNotificationIds))
  }, [readNotificationIds, userId])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !readNotificationIds.includes(notification.id)).length,
    [notifications, readNotificationIds],
  )

  const markRead = (notification) => {
    setReadNotificationIds((current) => current.includes(notification.id) ? current : [...current, notification.id])
    onSelect(notification)
    setOpen(false)
  }

  const markAllRead = () => setReadNotificationIds(notifications.map((notification) => notification.id))

  return (
    <div className="notification-menu">
      <button type="button" className="notification-trigger" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && <b className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</b>}
      </button>
      {open && (
        <div className="notification-panel" role="dialog" aria-label="Notifications">
          <div className="notification-panel-header"><div><span className="eyebrow">Student updates</span><h3>Notifications</h3></div><button type="button" className="text-button" onClick={markAllRead}>Mark all read</button></div>
          <div className="notification-list">
            {notifications.length ? notifications.map((notification) => {
              const unread = !readNotificationIds.includes(notification.id)
              return <button type="button" className={`notification-item ${unread ? 'unread' : ''}`} key={notification.id} onClick={() => markRead(notification)}><span className="notification-icon" aria-hidden="true">{notification.icon}</span><span className="notification-copy"><strong>{notification.title}</strong><span>{notification.message}</span><small>{notification.time}</small></span>{unread && <i className="notification-dot" aria-label="Unread" />}</button>
            }) : <p className="notification-empty">Sign in to receive event updates.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
