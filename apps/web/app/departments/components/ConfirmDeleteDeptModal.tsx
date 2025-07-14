import { TrashIcon } from "@heroicons/react/24/outline"
import React from "react"
import { Button } from "react-bootstrap"

/** * ConfirmDeleteDeptModal
 * Modal component for confirming department deletion.
 * Displays a confirmation message with the department name.
 * Includes buttons to cancel or confirm the deletion.
 * */

interface ConfirmDeleteDeptModalProps {
	show: boolean
	onClose: () => void
	onConfirm: () => void
	departmentName: string
}

const ConfirmDeleteDeptModal: React.FC<ConfirmDeleteDeptModalProps> = ({
	show,
	onClose,
	onConfirm,
	departmentName,
}) => {
	if (!show) return null
	return (
		<div
			className="modal fade show d-flex align-items-center justify-content-center"
			style={{
				display: "flex",
				background: "rgba(0,0,0,0.4)",
				minHeight: "100vh",
			}}
			tabIndex={-1}
		>
			<div className="modal-dialog" style={{ maxWidth: 400, margin: "auto" }}>
				<div className="modal-content" style={{ padding: 24 }}>
					<div className="modal-header">
						<h5 className="modal-title">Delete Department</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={onClose}
						></button>
					</div>
					<div className="modal-body text-center">
						<TrashIcon style={{ width: 22, height: 22 }} />
						<p>
							Are you sure you want to delete <strong>{departmentName}</strong>?
						</p>
					</div>
					<div className="modal-footer d-flex justify-content-between">
						<Button variant="secondary" onClick={onClose}>
							Cancel
						</Button>
						<Button variant="danger" onClick={onConfirm}>
							Delete
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ConfirmDeleteDeptModal
