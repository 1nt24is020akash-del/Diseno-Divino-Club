import { useEffect, useRef, useState } from 'react'
import { answerQuestion } from '../utils/chatbotService'

const suggestions = [
  'Upcoming Events',
  'Event Schedule',
  'Available Spots',
  'How to Register?',
  'About the Club',
  'My Activities',
]

const welcome = "Hi! 👋 I'm Divino AI, your Diseño Divino assistant.\n\nI can help you with events, activities, registrations, available spots, schedules, club information, and general questions. What would you like to know?"

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(true)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([{ id: 1, role: 'assistant', content: welcome }])
  const messagesRef = useRef(null)
  const inputRef = useRef(null)
  const messageId = useRef(2)

  useEffect(() => {
    if (!isOpen) return undefined
    inputRef.current?.focus()
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (value = input) => {
    const content = value.trim()
    if (!content || isTyping) return
    setInput('')
    setMessages((current) => [...current, { id: messageId.current++, role: 'user', content }])
    setIsTyping(true)
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: messageId.current++, role: 'assistant', content: answerQuestion(content) }])
      setIsTyping(false)
    }, 650)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage()
  }

  return (
    <aside className={`chatbot-widget ${isOpen ? 'is-open' : ''}`} aria-label="Divino AI student assistant">
      {isOpen && (
        <section className="chat-window" role="dialog" aria-modal="false" aria-labelledby="chat-title">
          <header className="chat-header">
            <div className="chat-identity">
              <div className="chat-avatar" aria-hidden="true">✦</div>
              <div>
                <strong id="chat-title">DIVINO AI</strong>
                <span><i aria-hidden="true" /> Online · Student Assistant</span>
              </div>
            </div>
            <button type="button" className="chat-close" onClick={() => setIsOpen(false)} aria-label="Minimize Divino AI">−</button>
          </header>

          <div className="chat-messages" ref={messagesRef} aria-live="polite">
            {messages.map((message) => (
              <div className={`chat-message ${message.role}`} key={message.id}>
                {message.role === 'assistant' && <span className="message-mark" aria-hidden="true">✦</span>}
                <p>{message.content}</p>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message assistant typing-indicator" aria-label="Divino AI is typing">
                <span className="message-mark" aria-hidden="true">✦</span>
                <p><i /><i /><i /></p>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="chat-suggestions" aria-label="Suggested questions">
              {suggestions.map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}</button>
              ))}
            </div>
          )}

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleSubmit(event)
                }
              }}
              placeholder="Ask Divino AI..."
              aria-label="Message Divino AI"
              rows="1"
            />
            <button type="submit" className="chat-send" aria-label="Send message" disabled={!input.trim() || isTyping}>↗</button>
          </form>
        </section>
      )}

      {!isOpen && (
        <button type="button" className="chat-launcher" onClick={() => setIsOpen(true)} aria-label="Open Divino AI assistant" aria-expanded={isOpen}>
          <span className="chat-launcher-ring" aria-hidden="true" />
          <span className="chat-launcher-icon" aria-hidden="true">✦</span>
          <span className="chat-launcher-label">AI</span>
        </button>
      )}
    </aside>
  )
}
