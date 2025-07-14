"use client"
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import NavBar from "../components/Navbar"
import { Employee } from "../types/employee"
import { Department } from "../types/department"
import EditEmployeeModal from "./[id]/EditEmployeeModal"
import SearchInput from "../components/SearchInput"
import Loader from "../components/Loader"
import { useRouter } from "next/navigation"
import EmployeeList from "./components/EmployeeList"
import ConfirmDeleteModal from "./components/ConfirmDeleteModal"

/** EmployeesPage
 * Main page for managing employees.
 * Displays a list of employees with options to create, edit, and delete.
 * Allows searching for employees by name.
 * Fetches employee and department data from the backend API.
 */

export default function EmployeesPage() {
	const [employees, setEmployees] = useState<Employee[]>([])
	const [departments, setDepartments] = useState<Department[]>([])
	const [loading, setLoading] = useState(true)
	const [showModal, setShowModal] = useState(false)
	const [deleteId, setDeleteId] = useState<string | null>(null)
	const [showEditModal, setShowEditModal] = useState(false)
	const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [searchTerm, setSearchTerm] = useState("")
	const [allEmployees, setAllEmployees] = useState<Employee[]>([])
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const API_URL = process.env.NEXT_PUBLIC_API_URL
	const router = useRouter()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [empRes, deptRes] = await Promise.all([
					fetch(`${API_URL}/employees`),
					fetch(`${API_URL}/departments`),
				])
				const empData = await empRes.json()
				const deptData = await deptRes.json()
				setEmployees(empData)
				setAllEmployees(empData)
				setDepartments(deptData)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [])

	function handleDelete(id: string) {
		setDeleteId(id)
		setShowModal(true)
	}

	function confirmDelete() {
		if (!deleteId) return
		fetch(`${API_URL}/employees/${deleteId}`, {
			method: "DELETE",
		})
			.then((res) => res.json())
			.then(() => {
				setEmployees((prev) => prev.filter((emp) => emp._id !== deleteId))
				setShowModal(false)
				setDeleteId(null)
			})
			.catch(() => {
				alert("Error deleting employee")
				setShowModal(false)
				setDeleteId(null)
			})
	}

	function handleEdit(emp: Employee) {
		setEditEmployee(emp)
		setShowEditModal(true)
	}

	function handleCreateEmployee() {
		setEditEmployee(null)
		setShowCreateModal(true)
	}

	function handleSaveEdit(updated: Partial<Employee>) {
		if (!editEmployee) return
		fetch(`${API_URL}/employees/${editEmployee._id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updated),
		})
			.then((res) => res.json())
			.then((data) => {
				setEmployees((prev) =>
					prev.map((emp) =>
						emp._id === editEmployee._id ? { ...emp, ...updated } : emp
					)
				)
				setShowEditModal(false)
				setEditEmployee(null)
			})
			.catch(() => {
				alert("Error updating employee")
				setShowEditModal(false)
				setEditEmployee(null)
			})
	}

	function handleSaveCreate(newEmployee: Partial<Employee>) {
		setErrorMsg(null)
		fetch("http://localhost:3001/api/employees", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newEmployee),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.message && data.message.includes("required")) {
					setErrorMsg(data.message)
					return
				}
				setEmployees((prev) => [...prev, data])
				setShowCreateModal(false)
				setErrorMsg(null)
			})
			.catch(() => {
				setErrorMsg("Error creating employee")
				setShowCreateModal(false)
			})
	}

	function handleNavigate(id: string) {
		setLoading(true)
		router.push(`/employees/${id}`)
	}

	return (
		<div>
			<NavBar />
			<div className="container my-5">
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h2 className="fw-bold text-custom-purple mb-0">Employees</h2>
					<div className="d-flex align-items-center gap-2">
						<SearchInput
							value={searchTerm}
							placeholder="Search employee..."
							onChange={(value) => {
								setSearchTerm(value)
								const val = value.toLowerCase()
								setEmployees(
									val
										? allEmployees.filter((e) =>
												e.name.toLowerCase().includes(val)
											)
										: [...allEmployees]
								)
							}}
						/>
						<button
							className="btn btn-success px-5 py-2 fw-bold text-nowrap"
							style={{
								backgroundColor: "#43a047",
								borderColor: "#43a047",
								minWidth: 260,
								whiteSpace: "nowrap",
							}}
							onClick={handleCreateEmployee}
						>
							+ Create Employee
						</button>
					</div>
				</div>
				{loading ? (
					<Loader />
				) : employees.length === 0 ? (
					<div className="alert alert-warning text-center" role="alert">
						No employees found.
					</div>
				) : (
					<EmployeeList
						employees={employees.filter((emp) => emp && emp._id)}
						departments={departments}
						onEdit={handleEdit}
						onDelete={handleDelete}
						onNavigate={handleNavigate}
					/>
				)}
				{/* Delete Employee Confirmation Modal */}
				{showModal && (
					<ConfirmDeleteModal
						show={showModal}
						onCancel={() => setShowModal(false)}
						onConfirm={confirmDelete}
					/>
				)}
				{/* Edit Employee Modal */}
				{showEditModal && (
					<EditEmployeeModal
						show={showEditModal}
						employee={editEmployee}
						departments={departments}
						onClose={() => {
							setShowEditModal(false)
							setEditEmployee(null)
						}}
						onSave={handleSaveEdit}
						mode="edit"
					/>
				)}
				{/* Create Employee Modal */}
				{showCreateModal && (
					<EditEmployeeModal
						show={showCreateModal}
						employee={null}
						departments={departments}
						onClose={() => setShowCreateModal(false)}
						onSave={handleSaveCreate}
						mode="create"
					/>
				)}
			</div>
		</div>
	)
}
