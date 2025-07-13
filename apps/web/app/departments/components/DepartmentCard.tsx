"use client"
import ListGroup from "react-bootstrap/ListGroup"
import { Department } from "../../types/department"
import { useRouter } from "next/navigation"

interface DepartmentCardProps {
	departments: Department[]
}

function DepartmentCard({ departments }: DepartmentCardProps) {
	const router = useRouter()
	return (
		<ListGroup as="ol">
			{departments.map((dept, idx) => (
				<ListGroup.Item
					as="li"
					className="d-flex justify-content-between align-items-start my-3 border listgroup-hover-blue"
					key={dept._id || idx}
					style={{ cursor: "pointer" }}
					onClick={() => router.push(`/departments/${dept._id || idx}`)}
				>
					<div className="ms-2 me-auto d-flex flex-column align-items-center gap-2 justify-content-center w-100">
						<div className="fw-bold fs-3">{dept.name}</div>
						<span>{dept.description}</span>
					</div>
				</ListGroup.Item>
			))}
		</ListGroup>
	)
}

export default DepartmentCard
