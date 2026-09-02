export default function ConfirmationDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal-card confirmation-card">
        <h3 id="confirm-title">{title}</h3>
        <p>{message}</p>
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>Keep it</button>
          <button type="button" className="danger-button" onClick={onConfirm}>Cancel Registration</button>
        </div>
      </div>
    </div>
  )
}
