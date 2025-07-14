import React, { useState } from "react"
import { Department } from "../../types/department"
import { Employee } from "../../types/employee"
import { Button } from "react-bootstrap"

/**
 * CreateDepartmentModal
 * Modal component for creating a new department.
 * Allows selecting employees and defining hierarchy.
 * Includes validation for required fields and cycle detection in the hierarchy.
 */

interface CreateDepartmentModalProps {
	show: boolean
	employees: Employee[]
	onClose: () => void
	onSave: (
		data: Partial<Department> & { hierarchy: Record<string, string | null> }
	) => void
}

const CreateDepartmentModal: React.FC<CreateDepartmentModalProps> = ({
	show,
	employees,
	onClose,
	onSave,
}) => {
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
	const [hierarchy, setHierarchy] = useState<Record<string, string | null>>({})
	const [error, setError] = useState("")

	function hasHierarchyCycle(
		hierarchy: Record<string, string | null>
	): boolean {
		// Check for cycles in the hierarchy
		for (const empId of Object.keys(hierarchy)) {
			let current = hierarchy[empId]
			const visited = new Set<string>()
			while (current) {
				if (visited.has(current)) return true
				visited.add(current)
				current = hierarchy[current] || null
			}
		}
		return false
	}

	function handleSave() {
		if (!name.trim()) {
			setError("Name is required.")
			return
		}
		if (!description.trim()) {
			setError("Description is required.")
			return
		}
		if (selectedEmployees.length === 0) {
			setError("Select at least one employee.")
			return
		}
		if (hasHierarchyCycle(hierarchy)) {
			setError("Hierarchy contains cycles. Please fix before saving.")
			return
		}
		setError("")
		onSave({ name, description, hierarchy })
	}

	function handleEmployeeChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const ids = Array.from(e.target.selectedOptions, (opt) => opt.value)
		setSelectedEmployees(ids)
		// Initialize hierarchy for selected employees
		setHierarchy((prev) => {
			const newHierarchy: Record<string, string | null> = { ...prev }
			ids.forEach((id) => {
				if (!(id in newHierarchy)) newHierarchy[id] = null
			})
			// Delete hierarchy entries for unselected employees
			Object.keys(newHierarchy).forEach((id) => {
				if (!ids.includes(id)) delete newHierarchy[id]
			})
			return newHierarchy
		})
	}

	function handleSuperiorChange(empId: string, superiorId: string) {
		setHierarchy((prev) => ({ ...prev, [empId]: superiorId || null }))
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
							<h5 className="modal-title">Create Department</h5>
							<button
								type="button"
								className="btn-close"
								onClick={onClose}
							></button>
						</div>
						<div className="modal-body">
							{error && (
								<div className="alert alert-danger mb-2" role="alert">
									{error}
								</div>
							)}
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
									<label className="form-label">Description</label>
									<input
										type="text"
										className="form-control"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									/>
								</div>
								<div className="mb-3">
									<label className="form-label">Employees</label>
									<div>
										{employees.map((emp) => (
											<div key={emp._id} className="form-check">
												<input
													className="form-check-input"
													type="checkbox"
													id={`emp-checkbox-${emp._id}`}
													checked={selectedEmployees.includes(emp._id)}
													onChange={(e) => {
														if (e.target.checked) {
															setSelectedEmployees((prev) => [...prev, emp._id])
															setHierarchy((prev) => ({
																...prev,
																[emp._id]: null,
															}))
														} else {
															setSelectedEmployees((prev) =>
																prev.filter((id) => id !== emp._id)
															)
															setHierarchy((prev) => {
																const newHierarchy = { ...prev }
																delete newHierarchy[emp._id]
																return newHierarchy
															})
														}
													}}
												/>
												<label
													className="form-check-label"
													htmlFor={`emp-checkbox-${emp._id}`}
												>
													{emp.name}
												</label>
											</div>
										))}
									</div>
								</div>
								{selectedEmployees.map((empId) => (
									<div key={empId} className="mb-3 border rounded p-2">
										<label className="form-label fw-bold">
											{employees.find((e) => e._id === empId)?.name} - Superior
										</label>
										<select
											className="form-select"
											value={hierarchy[empId] || ""}
											onChange={(e) =>
												handleSuperiorChange(empId, e.target.value)
											}
										>
											<option value="">None</option>
											{selectedEmployees
												.filter((id) => id !== empId)
												.map((id) => (
													<option key={id} value={id}>
														{employees.find((e) => e._id === id)?.name}
													</option>
												))}
										</select>
									</div>
								))}
							</form>
						</div>
						<div className="modal-footer">
							<Button variant="secondary" onClick={onClose}>
								Cancel
							</Button>
							<Button variant="primary" onClick={handleSave}>
								Create
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CreateDepartmentModal
