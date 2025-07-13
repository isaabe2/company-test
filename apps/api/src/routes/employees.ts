import { Router } from "express"
import {
	createEmployee,
	getEmployees,
	getEmployeeById,
	updateEmployee,
	deleteEmployee,
	getEmployeeDetails,
} from "../controllers/employees"

const router = Router()

router.post("/", createEmployee)
router.get("/", getEmployees)
router.get("/:id", getEmployeeById)
router.put("/:id", updateEmployee)
router.delete("/:id", deleteEmployee)
router.get("/:id/details", getEmployeeDetails)

export default router
