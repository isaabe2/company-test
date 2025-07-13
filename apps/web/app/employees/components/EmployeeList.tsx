"use client"
import React from "react"
import { Employee } from "../../types/employee"
import { Department } from "../../types/department"
import { TrashIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

interface EmployeeListProps {
	employees: Employee[]
	departments: Department[]
	onEdit: (emp: Employee) => void
	onDelete: (id: string) => void
	onNavigate?: (id: string) => void
}

function getDepartmentNames(deptArr: any[], departments: Department[]) {
	if (!deptArr || deptArr.length === 0) return ["No department"]
	return deptArr.map((dept) => {
		if (typeof dept === "string" || typeof dept === "number") {
			const found = departments.find(
				(d) => d._id.toString() === dept.toString()
			)
			return found ? found.name : "No department"
		} else if (typeof dept === "object" && dept !== null && dept._id) {
			return (
				dept.name ||
				departments.find((d) => d._id.toString() === dept._id.toString())
					?.name ||
				"No department"
			)
		}
		return "No department"
	})
}

const EmployeeList: React.FC<EmployeeListProps> = ({
	employees,
	departments,
	onEdit,
	onDelete,
	onNavigate,
}) => {
	const router = useRouter()
	function handleNavigate(id: string) {
		if (onNavigate) {
			onNavigate(id)
		} else {
			router.push(`/employees/${id}`)
		}
	}

	return (
		<ul className="list-group">
			{employees.map((emp) => {
				return (
					<li
						key={emp._id}
						className="list-group-item d-flex justify-content-between align-items-center mb-3 shadow-sm"
						style={{ borderRadius: 8 }}
					>
						<div>
							<div
								className="fw-bold"
								style={{ fontSize: "1.2rem" }}
								onClick={() => handleNavigate(emp._id)}
							>
								{emp.name}
							</div>
							<div className="text-muted" style={{ fontSize: "0.95rem" }}>
								Departments:{" "}
								{getDepartmentNames(emp.departments, departments).join(", ")}
							</div>
						</div>
						<div className="d-flex align-items-center" style={{ gap: 8 }}>
							<button
								className="btn btn-primary me-2 d-flex align-items-center justify-content-center"
								style={{
									backgroundColor: "#1a237e",
									borderColor: "#1a237e",
									minWidth: 38,
									height: 38,
								}}
								onClick={() => onEdit(emp)}
								title="Edit"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									fill="#fff"
									className="bi bi-pencil"
									viewBox="0 0 16 16"
								>
									<path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-4 1a.5.5 0 0 1-.62-.62l1-4a.5.5 0 0 1 .11-.168l10-10zM11.207 2L2 11.207V13h1.793L14 3.793 11.207 2zM15 3.207L12.793 1 13.5.293a1 1 0 0 1 1.414 0l.793.793a1 1 0 0 1 0 1.414L15 3.207z" />
								</svg>
								<span style={{ color: "#fff", fontWeight: 500 }} />
							</button>
							<button
								className="btn btn-danger d-flex align-items-center justify-content-center"
								style={{ minWidth: 48, height: 38 }}
								onClick={() => onDelete(emp._id)}
								title="Delete"
							>
								<TrashIcon style={{ width: 22, height: 22 }} />
							</button>
						</div>
					</li>
				)
			})}
		</ul>
	)
}

export default EmployeeList
