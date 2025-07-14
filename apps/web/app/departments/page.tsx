"use client"
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import NavBar from "../components/Navbar"
import DepartmentCard from "./components/DepartmentCard"
import { Department } from "../types/department"
import CreateDepartmentModal from "./components/CreateDepartmentModal"
import { Employee } from "../types/employee"
import SearchInput from "../components/SearchInput"
import Loader from "../components/Loader"

/**
 * DepartmentsPage
 * Main page for viewing, searching, and creating departments.
 * Fetches department and employee data from the backend API.
 * Displays a list of departments and a modal for creating new ones.
 */

export default function DepartmentsPage() {
	const [departments, setDepartments] = useState<Department[]>([])
	const [employees, setEmployees] = useState<Employee[]>([])
	const [loading, setLoading] = useState(true)
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [searchTerm, setSearchTerm] = useState("")
	const [allDepartments, setAllDepartments] = useState<Department[]>([])
	const API_URL = process.env.NEXT_PUBLIC_API_URL

	useEffect(() => {
		Promise.all([
			fetch(`${API_URL}/departments`).then((res) => res.json()),
			fetch(`${API_URL}/employees`).then((res) => res.json()),
		]).then(([deptData, empData]) => {
			setDepartments(deptData)
			setAllDepartments(deptData)
			setEmployees(empData)
			setLoading(false)
		})
	}, [])

	function handleSaveCreate(
		newDept: Partial<Department> & { hierarchy: Record<string, string | null> }
	) {
		fetch(`${API_URL}/departments`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newDept),
		})
			.then((res) => res.json())
			.then((data) => {
				setDepartments((prev) => [...prev, data])
				setShowCreateModal(false)
			})
			.catch(() => {
				alert("Error creating department")
				setShowCreateModal(false)
			})
	}

	return (
		<div>
			<NavBar />
			<div className="container my-5">
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h2 className="fw-bold text-custom-purple mb-0">Departments</h2>
					<div className="d-flex align-items-center gap-2">
						<SearchInput
							value={searchTerm}
							placeholder="Search department..."
							onChange={(value) => {
								setSearchTerm(value)
								const val = value.toLowerCase()
								setDepartments(
									val
										? allDepartments.filter((d) =>
												d.name.toLowerCase().includes(val)
											)
										: [...allDepartments]
								)
							}}
						/>
						<Button
							variant="success"
							className="px-5 py-2 fw-bold text-nowrap"
							style={{
								backgroundColor: "#43a047",
								borderColor: "#43a047",
								minWidth: 260,
								whiteSpace: "nowrap",
							}}
							onClick={() => setShowCreateModal(true)}
						>
							+ Create Department
						</Button>
					</div>
				</div>
				{loading ? (
					<Loader />
				) : (
					<div className="my-5 mx-auto w-50 justify-content-center align-items-center">
						{departments.length === 0 ? (
							<div className="alert alert-warning text-center" role="alert">
								No departments found.
							</div>
						) : (
							<DepartmentCard departments={departments} />
						)}
					</div>
				)}
				{/* Create department modal */}
				{showCreateModal && (
					<CreateDepartmentModal
						show={showCreateModal}
						employees={employees}
						onClose={() => setShowCreateModal(false)}
						onSave={handleSaveCreate}
					/>
				)}
			</div>
		</div>
	)
}
