"use client"
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import NavBar from "../../components/Navbar"
import { Department } from "../../types/department"
import { Employee } from "../../types/employee"
import { TrashIcon, UserIcon } from "@heroicons/react/24/solid"
import EditDeptModal from "./EditDeptModal"
import ConfirmDeleteDeptModal from "../components/ConfirmDeleteDeptModal"
import Loader from "../../components/Loader"

export default function DepartmentDetailPage() {
	const params = useParams()
	const id = params?.id as string
	const [department, setDepartment] = useState<Department | null>(null)
	const [employees, setEmployees] = useState<Employee[]>([])
	const [loading, setLoading] = useState(true)
	const [showEditModal, setShowEditModal] = useState(false)
	const [pendingUpdate, setPendingUpdate] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [pendingDelete, setPendingDelete] = useState(false)

	useEffect(() => {
		if (!id) return
		const fetchData = async () => {
			try {
				const [deptRes, empRes] = await Promise.all([
					fetch(`http://localhost:3001/api/departments/${id}`),
					fetch(`http://localhost:3001/api/employees?department=${id}`),
				])
				const deptData = await deptRes.json()
				const empData = await empRes.json()
				setDepartment(deptData)
				setEmployees(empData)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [id])

	function handleEditSave(updated: { name: string; description: string }) {
		if (!department) return
		setPendingUpdate(true)
		fetch(`http://localhost:3001/api/departments/${department._id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updated),
		})
			.then((res) => res.json())
			.then((data) => {
				setDepartment((prev) => (prev ? { ...prev, ...updated } : prev))
				setShowEditModal(false)
			})
			.catch((err) => alert("Error al actualizar departamento"))
			.finally(() => setPendingUpdate(false))
	}

	function handleDeleteDepartment() {
		if (!department) return
		setPendingDelete(true)
		fetch(`http://localhost:3001/api/departments/${department._id}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok) {
					window.location.href = "/departments"
				} else {
					alert("Error deleting department")
				}
			})
			.catch(() => alert("Error deleting department"))
			.finally(() => setPendingDelete(false))
	}

	function renderHierarchy() {
		if (!department || !department.hierarchy) return null
		const hierarchy = department.hierarchy
		// Find employees with no superior
		const roots = Object.entries(hierarchy)
			.filter(([_, value]) => !value)
			.map(([id]) => id)
			.sort((a, b) => {
				const empA = employees.find((e) => e._id === a)
				const empB = employees.find((e) => e._id === b)
				return empA && empB ? empA.name.localeCompare(empB.name) : 0
			})

		function renderNode(empId: string) {
			const emp = employees.find((e) => e._id === empId)
			if (!emp) return null
			// Buscar subordinados directos de este empleado
			const subordinates = Object.entries(hierarchy)
				.filter(([_, superiorId]) => superiorId === empId)
				.map(([subId]) => subId)
				.sort((a, b) => {
					const empA = employees.find((e) => e._id === a)
					const empB = employees.find((e) => e._id === b)
					return empA && empB ? empA.name.localeCompare(empB.name) : 0
				})
			return (
				<li key={empId} style={{ listStyle: "none", marginLeft: 0 }}>
					<div className="d-flex align-items-center gap-2 mb-2">
						<UserIcon style={{ width: 24, height: 24, color: "#1a237e" }} />
						<strong>{emp.name}</strong>
					</div>
					{subordinates.length > 0 && (
						<ul>{subordinates.map((subId) => renderNode(subId))}</ul>
					)}
				</li>
			)
		}

		return <ul>{roots.map((rootId) => renderNode(rootId))}</ul>
	}

	return (
		<div>
			<NavBar />
			<div
				className="container-fluid d-flex flex-column align-items-center  my-5"
				style={{ minHeight: "80vh" }}
			>
				{loading ? (
					<Loader />
				) : department ? (
					<div className="w-100" style={{ maxWidth: 800 }}>
						<div className="card shadow p-4 mb-4 w-100">
							<div className="d-flex flex-row justify-content-between align-items-center w-100">
								<h2 className="fw-bold mb-3 m-0">{department.name}</h2>
								<div
									className="d-flex flex-column align-items-end gap-2"
									style={{ minWidth: 120 }}
								>
									<button
										className="btn btn-primary d-flex align-items-center gap-2 w-100"
										style={{
											height: 40,
											backgroundColor: "#1a237e",
											borderColor: "#1a237e",
											minWidth: 120,
										}}
										onClick={() => setShowEditModal(true)}
										aria-label="Editar departamento"
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
										<span style={{ color: "#fff", fontWeight: 500 }}>
											Editar
										</span>
									</button>
									<button
										className="btn btn-danger d-flex align-items-center gap-2 w-100"
										style={{
											height: 40,
											backgroundColor: "#d32f2f",
											borderColor: "#d32f2f",
											minWidth: 120,
										}}
										onClick={() => setShowDeleteModal(true)}
										aria-label="Eliminar departamento"
									>
										<TrashIcon style={{ width: 22, height: 22 }} />
										<span style={{ color: "#fff", fontWeight: 500 }}>
											Eliminar
										</span>
									</button>
								</div>
							</div>
							<p>{department.description}</p>
						</div>
						<div className="card shadow p-4 w-100">
							<h4 className="fw-bold mb-3">Hierarchy</h4>
							{renderHierarchy()}
						</div>
					</div>
				) : (
					<div className="text-center text-danger">Department not found</div>
				)}
			</div>
			<EditDeptModal
				show={showEditModal}
				onClose={() => setShowEditModal(false)}
				department={department}
				employees={employees}
				onSave={handleEditSave}
			/>
			<ConfirmDeleteDeptModal
				show={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDeleteDepartment}
				departmentName={department?.name || ""}
			/>
		</div>
	)
}
