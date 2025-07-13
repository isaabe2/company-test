import { Request, Response } from "express"
import { Department, Hierarchy } from "../models/Department"
import { Employee } from "../models/Employee"
import { Types } from "mongoose"

interface HierarchyInput {
	superior?: string
	subordinates: string[]
}

// Function to check for cycles in the hierarchy
function hasCycle(
	hierarchy: Record<string, any>,
	startId: string,
	currentId: string,
	visited = new Set<string>()
): boolean {
	if (visited.has(currentId)) return true
	visited.add(currentId)

	const node = hierarchy[currentId]
	if (!node || !node.subordinates) return false

	for (const subId of node.subordinates) {
		if (subId.toString() === startId) return true
		if (hasCycle(hierarchy, startId, subId.toString(), visited)) return true
	}

	return false
}

// Create department
export const createDepartment = async (req: Request, res: Response) => {
	try {
		const { name, description, hierarchy } = req.body

		const hierarchyObj: Record<string, any> = hierarchy || {}

		// Validate that hierarchy is an object
		for (const empId in hierarchyObj) {
			if (hasCycle(hierarchyObj, empId, empId)) {
				return res.status(400).json({
					message: "Hierarchy contains cycles. Please fix before saving.",
				})
			}
		}

		const department = new Department({
			name,
			description,
			hierarchy: hierarchyObj,
		})

		await department.save()

		const employeeIds = Object.keys(hierarchyObj)
		await Employee.updateMany(
			{ _id: { $in: employeeIds } },
			{ $addToSet: { departments: department._id } }
		)

		res.status(201).json(department)
	} catch (error) {
		res.status(500).json({ message: "Error creating department", error })
	}
}

// Get all departments
export const getDepartments = async (_req: Request, res: Response) => {
	try {
		const departments = await Department.find().lean()

		const result = departments.map((dept) => {
			const hierarchyObj: Record<string, any> = {}
			if (dept.hierarchy) {
				for (const [key, value] of Object.entries(dept.hierarchy)) {
					hierarchyObj[key] = value
				}
			}
			return {
				_id: dept._id,
				name: dept.name,
				description: dept.description,
				hierarchy: hierarchyObj,
			}
		})
		res.json(result)
	} catch (error) {
		res.status(500).json({ message: "Error obteniendo departamentos", error })
	}
}

// Get department by ID
export const getDepartmentById = async (req: Request, res: Response) => {
	try {
		const department = await Department.findById(req.params.id).lean()
		if (!department)
			return res.status(404).json({ message: "Departamento no encontrado" })

		// Convertir Map a objeto plano para frontend
		const hierarchyObj: Record<string, any> = {}
		if (department.hierarchy) {
			for (const [key, value] of Object.entries(department.hierarchy)) {
				hierarchyObj[key] = value
			}
		}
		res.json({
			_id: department._id,
			name: department.name,
			description: department.description,
			hierarchy: hierarchyObj,
		})
	} catch (error) {
		res.status(500).json({ message: "Error obteniendo departamento", error })
	}
}

// Uodate department
export const updateDepartment = async (req: Request, res: Response) => {
	try {
		const { name, description, hierarchy } = req.body

		const department = await Department.findById(req.params.id)
		if (!department)
			return res.status(404).json({ message: "Department not found" })

		department.name = name ?? department.name
		department.description = description ?? department.description

		if (hierarchy) {
			// Validate hierarchy for cycles
			for (const empId in hierarchy) {
				if (hasCycle(hierarchy, empId, empId)) {
					return res
						.status(400)
						.json({ message: "La jerarquía contiene ciclos" })
				}
			}
			department.hierarchy = hierarchy
		}

		await department.save()
		console.log("Updating")
		if (hierarchy) {
			console.log("Updating employees with new department")
			const employeeIds = Object.keys(hierarchy)
			await Employee.updateMany(
				{ _id: { $in: employeeIds } },
				{ $addToSet: { departments: department._id } }
			)
		}
		res.json(department)
	} catch (error) {
		res.status(500).json({ message: "Error updating department", error })
	}
}

// Delete department
export const deleteDepartment = async (req: Request, res: Response) => {
	try {
		const department = await Department.findByIdAndDelete(req.params.id)
		if (!department) {
			return res.status(404).json({ message: "Department not found" })
		}
		// Delete department from all employees
		await Employee.updateMany(
			{ departments: { $in: [department._id, department._id] } },
			{ $pull: { departments: department._id } }
		)
		res.json({ message: "Department deleted successfully" })
	} catch (error) {
		res.status(500).json({ message: "Error deleting department", error })
	}
}
