import { useEffect, useMemo, useRef, useState } from 'react'
import { branches } from '../data/branchOptions'

const normalizeSearch = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

export default function BranchSelect({ value, onChange, hasError, options = branches, placeholder = 'Choose your branch', noMatchText = 'No branch found', fieldLabel = 'Choose your branch', searchPlaceholder = 'Search your branch...' }) {
  const rootRef = useRef(null)
  const searchRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [openUpward, setOpenUpward] = useState(false)
  const [optionsMaxHeight, setOptionsMaxHeight] = useState(248)
  const selectedBranch = value || placeholder
  const filteredBranches = useMemo(() => {
    const normalized = normalizeSearch(query.trim())
    return options.filter((branch) => normalizeSearch(branch).includes(normalized))
  }, [options, query])

  useEffect(() => {
    if (!isOpen) return undefined
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    searchRef.current?.focus()
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [isOpen])

  const open = () => {
    const rect = rootRef.current?.getBoundingClientRect()
    const spaceBelow = window.innerHeight - (rect?.bottom || 0)
    const shouldOpenUpward = spaceBelow < 330
    const availableSpace = shouldOpenUpward ? (rect?.top || 0) - 24 : spaceBelow - 24
    setOpenUpward(shouldOpenUpward)
    setOptionsMaxHeight(Math.max(90, Math.min(248, availableSpace - 68)))
    setIsOpen(true)
  }

  const selectBranch = (branch) => {
    onChange(branch)
    setQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (event) => {
    if (!isOpen && ['Enter', ' ', 'ArrowDown'].includes(event.key)) {
      event.preventDefault()
      open()
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      return
    }
    if (!filteredBranches.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((index) => Math.min(index + 1, filteredBranches.length - 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((index) => Math.max(index - 1, 0))
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      selectBranch(filteredBranches[highlightedIndex])
    }
  }

  return (
    <div className={`branch-select ${isOpen ? 'is-open' : ''} ${openUpward ? 'opens-upward' : ''}`} ref={rootRef}>
      <button
        type="button"
        className={`branch-trigger ${hasError ? 'has-error' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={fieldLabel}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
      >
        <span className={value ? 'selected' : ''}>{selectedBranch}</span>
        <span className="branch-chevron" aria-hidden="true">⌄</span>
      </button>
      {isOpen && (
        <div className="branch-menu" role="listbox" aria-label="Branch options">
          <div className="branch-search-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => { setQuery(event.target.value); setHighlightedIndex(0) }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder.replace('...', '')}
            />
          </div>
          <div className="branch-options" style={{ '--branch-options-height': `${optionsMaxHeight}px` }}>
            {filteredBranches.length ? filteredBranches.map((branch, index) => (
              <button
                type="button"
                role="option"
                aria-selected={value === branch}
                className={`branch-option ${value === branch ? 'selected' : ''} ${highlightedIndex === index ? 'highlighted' : ''}`}
                key={branch}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectBranch(branch)}
              >
                {branch}
              </button>
            )) : <div className="branch-empty">{noMatchText}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
