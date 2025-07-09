import { Router } from "express"
import {
	createDepartment,
	getDepartments,
	getDepartmentById,
	updateDepartment,
} from "../controllers/departments"

const router = Router()

router.post("/", createDepartment)
router.get("/", getDepartments)
router.get("/:id", getDepartmentById)
router.put("/:id", updateDepartment)

export default router
