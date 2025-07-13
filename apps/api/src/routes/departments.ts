import { Router } from "express"
import {
	createDepartment,
	getDepartments,
	getDepartmentById,
	updateDepartment,
	deleteDepartment,
} from "../controllers/departments"

const router = Router()

router.post("/", createDepartment)
router.get("/", getDepartments)
router.get("/:id", getDepartmentById)
router.put("/:id", updateDepartment)
router.delete("/:id", deleteDepartment)

export default router
