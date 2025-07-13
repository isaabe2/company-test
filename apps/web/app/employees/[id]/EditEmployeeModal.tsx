import React, { useState } from "react"
import { Employee } from "../../types/employee"
import { Department } from "../../types/department"

interface EditEmployeeModalProps {
	show: boolean
	employee: Employee | null
	departments: Department[]
	onClose: () => void
	onSave: (updated: Partial<Employee>) => void
	mode?: "edit" | "create"
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
	show,
	employee,
	departments,
	onClose,
	onSave,
	mode = "edit",
}) => {
	const [name, setName] = useState(employee?.name || "")
	const [email, setEmail] = useState(employee?.email || "")
	const [error, setError] = useState("")

	React.useEffect(() => {
		if (employee) {
			setName(employee.name)
			setEmail(employee.email)
		} else {
			setName("")
			setEmail("")
		}
	}, [employee])

	function handleSave() {
		if (!name.trim()) {
			setError("Name is required.")
			return
		}
		if (!email.trim()) {
			setError("Email is required.")
			return
		}
		setError("")
		onSave({ name, email })
	}

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
							<h5 className="modal-title">
								{mode === "create" ? "Create Employee" : "Edit Employee"}
							</h5>
							<button
								type="button"
								className="btn-close"
								onClick={onClose}
							></button>
						</div>
						{error && (
							<div
								className="alert alert-danger mb-2"
								role="alert"
								style={{
									color: "#b71c1c",
									backgroundColor: "#fdecea",
									borderColor: "#f5c6cb",
								}}
							>
								{error}
							</div>
						)}
						<div className="modal-body">
							<form>
								<div className="mb-3">
									<label className="form-label">Name</label>
									<input
										type="text"
										className="form-control"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="mb-3">
									<label className="form-label">Email</label>
									<input
										type="email"
										className="form-control"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={onClose}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleSave}
							>
								{mode === "create" ? "Create" : "Save Changes"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default EditEmployeeModal
