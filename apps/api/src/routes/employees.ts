import { Router } from "express"
import {
	createEmployee,
	getEmployees,
	getEmployeeById,
	updateEmployee,
} from "../controllers/employees"

const router = Router()

router.post("/", createEmployee)
router.get("/", getEmployees)
router.get("/:id", getEmployeeById)
router.put("/:id", updateEmployee)

export default router
