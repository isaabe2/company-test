import React, { useState } from "react"
import { Department } from "../../types/department"
import { Employee } from "../../types/employee"

/**
 * EditDeptModal
 * Modal component for editing a department.
 * Allows updating the department's name, description, employees, and hierarchy.
 * Includes validation for required fields and cycle detection in the hierarchy.
 */

interface EditDeptModalProps {
	show: boolean
	onClose: () => void
	department: Department | null
	employees: Employee[]
	onSave: (updated: {
		name: string
		description: string
		hierarchy: any
	}) => void
}

const EditDeptModal: React.FC<EditDeptModalProps> = ({
	show,
	onClose,
	department,
	employees,
	onSave,
}) => {
	const [name, setName] = useState(department?.name || "")
	const [description, setDescription] = useState(department?.description || "")
	const [selectedEmployees, setSelectedEmployees] = useState<string[]>(
		department?.hierarchy ? Object.keys(department.hierarchy) : []
	)
	const [hierarchy, setHierarchy] = useState<Record<string, string | null>>(
		department?.hierarchy || {}
	)
	const [search, setSearch] = useState("")
	const [error, setError] = useState("")

	React.useEffect(() => {
		setName(department?.name || "")
		setDescription(department?.description || "")
		setSelectedEmployees(
			department?.hierarchy ? Object.keys(department.hierarchy) : []
		)
		setHierarchy(department?.hierarchy || {})
	}, [department])

	function handleEmployeeChange(empId: string, checked: boolean) {
		if (checked) {
			setSelectedEmployees((prev) => [...prev, empId])
			setHierarchy((prev) => ({ ...prev, [empId]: null }))
		} else {
			setSelectedEmployees((prev) => prev.filter((id) => id !== empId))
			setHierarchy((prev) => {
				const newHierarchy = { ...prev }
				delete newHierarchy[empId]
				return newHierarchy
			})
		}
	}

	function handleSuperiorChange(empId: string, superiorId: string) {
		setHierarchy((prev) => ({ ...prev, [empId]: superiorId || null }))
	}

	function hasCycle(hierarchy: any): boolean {
		// Depth-first search to detect cycles
		const visited: Record<string, boolean> = {}
		const stack: Record<string, boolean> = {}

		function dfs(empId: string): boolean {
			if (!hierarchy[empId]) return false
			if (stack[empId]) return true
			if (visited[empId]) return false
			visited[empId] = true
			stack[empId] = true
			const sup = hierarchy[empId].superior
			if (sup && dfs(sup)) return true
			stack[empId] = false
			return false
		}

		return Object.keys(hierarchy).some(dfs)
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError("")
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
		if (hasCycle(hierarchy)) {
			setError(
				"Hierarchy contains a cycle. Please fix the supervisors before saving."
			)
			return
		}
		onSave({ name, description, hierarchy })
	}

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
			<div
				className="modal-dialog"
				style={{
					maxWidth: 900,
					width: "90vw",
					maxHeight: "80vh",
					margin: "auto",
				}}
			>
				<div
					className="modal-content"
					style={{ padding: 40, maxHeight: "80vh", overflowY: "auto" }}
				>
					<div className="modal-header" style={{ paddingBottom: 16 }}>
						<h5 className="modal-title">Edit Department</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
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
					<form onSubmit={handleSubmit}>
						<div className="modal-body" style={{ padding: 0 }}>
							<div className="mb-3">
								<label className="form-label pt-3 text-custom-purple">
									Department Name
								</label>
								<input
									type="text"
									className="form-control"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="mb-3">
								<label className="form-label text-custom-purple">
									Description
								</label>
								<textarea
									className="form-control"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									rows={3}
								/>
							</div>
							{employees.length > 0 && (
								<div className="mb-3">
									<label className="form-label text-custom-purple">
										Employees
									</label>
									<input
										type="text"
										className="form-control mb-2"
										placeholder="Search employee..."
										value={search}
										onChange={(e) => setSearch(e.target.value)}
									/>
									<div
										className="border rounded p-2"
										style={{
											maxHeight: 200,
											overflowY: "auto",
										}}
									>
										{employees
											.filter((emp) =>
												emp.name.toLowerCase().includes(search.toLowerCase())
											)
											.map((emp) => (
												<div key={emp._id} className="form-check">
													<input
														className="form-check-input"
														type="checkbox"
														id={`emp-checkbox-${emp._id}`}
														checked={selectedEmployees.includes(emp._id)}
														onChange={(e) =>
															handleEmployeeChange(emp._id, e.target.checked)
														}
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
							)}
							{selectedEmployees.length > 0 && (
								<div className="mb-3">
									<label className="form-label text-custom-purple">
										Hierarchy
									</label>
									<div className="border rounded p-2">
										{selectedEmployees.map((empId) => (
											<div key={empId} className="mb-3 border rounded p-2">
												<label className="form-label fw-bold">
													{employees.find((e) => e._id === empId)?.name} -
													Superior
												</label>
												<select
													className="form-select"
													value={
														hierarchy[empId] &&
														typeof hierarchy[empId] === "object" &&
														"superior" in hierarchy[empId]
															? (hierarchy[empId] as any).superior || ""
															: hierarchy[empId] || ""
													}
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
									</div>
								</div>
							)}
						</div>
						<div className="modal-footer" style={{ paddingTop: 16 }}>
							<button
								type="button"
								className="btn btn-secondary"
								onClick={onClose}
							>
								Cancelar
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								style={{
									backgroundColor: "#1a237e",
									borderColor: "#1a237e",
								}}
							>
								Guardar Cambios
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default EditDeptModal
