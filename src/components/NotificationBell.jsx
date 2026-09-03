import { useEffect, useMemo, useRef, useState } from 'react'

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
  const menuRef = useRef(null)
  const audioContextRef = useRef(null)
  const previousNotificationIds = useRef(null)
  const [open, setOpen] = useState(false)
  const [readNotificationIds, setReadNotificationIds] = useState(() => userId ? readIds(userId) : [])

  useEffect(() => {
    if (userId) localStorage.setItem(`${STORAGE_KEY}-${userId}`, JSON.stringify(readNotificationIds))
  }, [readNotificationIds, userId])

  useEffect(() => {
    if (!open) return undefined
    const handleOutsidePointer = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false)
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handleOutsidePointer)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  useEffect(() => {
    const currentIds = notifications.map((notification) => notification.id)
    if (previousNotificationIds.current === null) {
      previousNotificationIds.current = currentIds
      return
    }
    const hasNewNotification = currentIds.some((id) => !previousNotificationIds.current.includes(id))
    previousNotificationIds.current = currentIds
    if (!hasNewNotification || !audioContextRef.current || document.hidden) return
    const context = audioContextRef.current
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1320, context.currentTime + 0.12)
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.24)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.24)
  }, [notifications])

  const prepareNotificationSound = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return
      audioContextRef.current = new AudioContextClass()
    }
    if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume()
  }

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
    <div className="notification-menu" ref={menuRef}>
      <button type="button" className="notification-trigger" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={open} onClick={() => { prepareNotificationSound(); setOpen((value) => !value) }}>
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && <b className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</b>}
      </button>
      {open && (
        <div className="notification-panel" role="dialog" aria-label="Notifications">
          <div className="notification-panel-header"><div><span className="eyebrow">Student updates</span><h3>Notifications</h3></div><div className="notification-panel-actions"><button type="button" className="text-button" onClick={markAllRead}>Mark all read</button><button type="button" className="notification-close" aria-label="Close notifications" onClick={() => setOpen(false)}>×</button></div></div>
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
