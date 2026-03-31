export function ConfirmDialog({ message, onConfirm, onCancel }) {
	return (
		<div className="t-modal-overlay" onClick={onCancel}>
			<div
				className="t-modal"
				style={{ maxWidth: 360 }}
				onClick={(e) => e.stopPropagation()}>
				<div className="t-confirm-body">
					<div className="t-confirm-icon">🗑️</div>
					<h3>Xác nhận xoá</h3>
					<p>{message}</p>
					<div className="t-confirm-actions">
						<button className="t-btn t-btn-ghost" onClick={onCancel}>
							Huỷ
						</button>
						<button className="t-btn t-btn-danger" onClick={onConfirm}>
							Xoá
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
