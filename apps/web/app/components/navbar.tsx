"use client"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import Link from "next/link"
import { usePathname } from "next/navigation"

function NavBar() {
	const pathname = usePathname()

	return (
		<Navbar expand="lg" className="custom-bg-purple">
			<Container>
				<Navbar.Brand>
					<Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
						COMPANYNAME
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto" style={{ color: "#fff" }}>
						<Nav.Link
							as={Link}
							href="/departments"
							style={{ color: "#fff" }}
							className={`custom-nav-link${
								pathname === "/departments" ? " active" : ""
							}`}
						>
							Departments
						</Nav.Link>
						<Nav.Link
							as={Link}
							href="/employees"
							style={{ color: "#fff" }}
							className={`custom-nav-link${
								pathname === "/employees" ? " active" : ""
							}`}
						>
							Employees
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default NavBar
