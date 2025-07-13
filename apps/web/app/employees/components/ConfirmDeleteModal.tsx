import React from "react"

interface ConfirmDeleteModalProps {
	show: boolean
	onCancel: () => void
	onConfirm: () => void
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
	show,
	onCancel,
	onConfirm,
}) => {
	if (!show) return null
	return (
		<>
			<div
				className="modal-backdrop show"
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					background: "rgba(0,0,0,0.5)",
					zIndex: 1040,
				}}
			></div>
			<div className="modal show d-block" tabIndex={-1}>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Confirm Delete</h5>
							<button
								type="button"
								className="btn-close"
								onClick={onCancel}
							></button>
						</div>
						<div className="modal-body">
							<p>Are you sure you want to delete this employee?</p>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={onCancel}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-danger"
								onClick={onConfirm}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ConfirmDeleteModal
