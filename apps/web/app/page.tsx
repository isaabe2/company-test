"use client"
import "bootstrap/dist/css/bootstrap.min.css"
import Button from "react-bootstrap/Button"
import { UserGroupIcon, BuildingOffice2Icon } from "@heroicons/react/24/solid"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Loader from "./components/Loader"

/** Home
 * Main landing page for the application.
 * Provides navigation to employees and departments sections.
 * Displays a welcome message and loading state while navigating.
 */

export default function Home() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	function handleNavigate(path: string) {
		setLoading(true)
		router.push(path)
	}
	return (
		<div className="min-vh-100 d-flex flex-column justify-content-center align-items-center custom-bg-blue">
			<p className="display-3 fw-bold text-center mb-xl custom-purple-text">
				WELCOME TO COMPANY-TEST
			</p>
			<p className="lead text-center mb-5 custom-purple-text">
				Manage your employees and departments efficiently
			</p>
			<main className="w-100 d-flex flex-column align-items-center justify-content-center">
				{loading ? (
					<Loader />
				) : (
					<div className="d-flex gap-4 flex-row align-items-center justify-content-center">
						<Button
							variant="dark"
							size="lg"
							className="px-5 py-3 d-flex flex-column justify-content-center align-items-center gap-2 custom-purple border-0 custom-btn-lg"
							onClick={() => router.push("/employees")}
						>
							<UserGroupIcon
								width={100}
								height={100}
								className="mb-2 text-white mx-auto d-block"
							/>
							<span className="text-center w-100">Employees</span>
						</Button>
						<Button
							variant="dark"
							size="lg"
							className="px-5 py-3 d-flex flex-column justify-content-center align-items-center gap-2 custom-purple border-0 custom-btn-lg"
							onClick={() => router.push("/departments")}
						>
							<BuildingOffice2Icon
								width={100}
								height={100}
								className="mb-2 text-white mx-auto d-block"
							/>
							<span className="text-center w-100">Departments</span>
						</Button>
					</div>
				)}
			</main>
		</div>
	)
}
