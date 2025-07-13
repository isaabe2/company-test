"use client"
import "bootstrap/dist/css/bootstrap.min.css"

import React from "react"
import { useEffect, useState, use } from "react"
import NavBar from "../../components/Navbar"
import Loader from "../../components/Loader"

interface DepartmentDetail {
	_id: string
	name: string
	superior: { _id: string; name: string } | null
	subordinates: { _id: string; name: string }[]
}

interface EmployeeDetail {
	_id: string
	name: string
	email: string
	departments: DepartmentDetail[]
}

const EmployeeDetailPage = ({ params }: { params: { id: string } }) => {
	const { id } = params
	const [employee, setEmployee] = useState<EmployeeDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const API_URL = process.env.NEXT_PUBLIC_API_URL

	useEffect(() => {
		if (!id) return
		fetch(`${API_URL}/employees/${id}/details`)
			.then((res) => res.json())
			.then((data) => {
				setEmployee(data)
				setLoading(false)
			})
			.catch(() => {
				setError("Error loading employee details")
				setLoading(false)
			})
	}, [id])

	if (loading) return <Loader />
	if (error) return <div>{error}</div>
	if (!employee) return <div>Employee not found</div>

	return (
		<div>
			<NavBar />
			<div className="container my-5">
				<div className="card shadow mb-4">
					<div className="card-body">
						<h2 className="fw-bold mb-3">
							<i className="bi bi-person-circle me-2" />
							{employee.name}
						</h2>
						<p className="mb-2">
							<i className="bi bi-envelope me-2" />
							Email: {employee.email}
						</p>
					</div>
				</div>
				<h4 className="mt-4 mb-3">
					<i className="bi bi-diagram-3 me-2" />
					Departments
				</h4>
				<ul className="list-group">
					{employee.departments.map((dept) => (
						<li
							key={dept._id}
							className="list-group-item mb-3 border rounded shadow-sm"
						>
							<div className="fw-bold mb-1">
								<i className="bi bi-building me-2" />
								{dept.name}
							</div>
							<div>
								<strong>
									<i className="bi bi-person-badge me-1" />
									Superior:
								</strong>{" "}
								{dept.superior?.name || "None"}
							</div>
							<div>
								<strong>
									<i className="bi bi-people me-1" />
									Subordinates:
								</strong>{" "}
								{dept.subordinates.length > 0
									? dept.subordinates.map((sub) => sub.name).join(", ")
									: "None"}
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
export default EmployeeDetailPage
