export default function SearchBar({ value, onChange, placeholder = 'Search activities or keywords' }) {
  return (
    <label className="search-field" aria-label="Search activities">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10.5 3a7.5 7.5 0 0 1 5.9 12.8l4.4 4.4 1.4-1.4-4.4-4.4A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" />
      </svg>
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  )
}
