import { Request, Response } from "express"
import { Department } from "../models/Department"
import { Employee } from "../models/Employee"

// Create department
export const createDepartment = async (req: Request, res: Response) => {
	try {
		const { name, description, members } = req.body

		const department = new Department({
			name,
			description,
			members: members || [],
		})

		await department.save()

		// Update members: add this department to each member's departments
		if (members && members.length > 0) {
			await Employee.updateMany(
				{ _id: { $in: members } },
				{ $addToSet: { departments: department._id } }
			)
		}

		res.status(201).json(department)
	} catch (error) {
		res.status(500).json({ message: "Error creating department", error })
	}
}

// Get all departments
export const getDepartments = async (_req: Request, res: Response) => {
	try {
		const departments = await Department.find().populate("members")
		res.json(departments)
	} catch (error) {
		res.status(500).json({ message: "Error fetching departments", error })
	}
}

// Get department by ID
export const getDepartmentById = async (req: Request, res: Response) => {
	try {
		const department = await Department.findById(req.params.id).populate(
			"members"
		)
		if (!department)
			return res.status(404).json({ message: "Department not found" })
		res.json(department)
	} catch (error) {
		res.status(500).json({ message: "Error fetching department", error })
	}
}

// Edit department by ID
export const updateDepartment = async (req: Request, res: Response) => {
	try {
		const { name, description, members } = req.body

		const department = await Department.findById(req.params.id)
		if (!department)
			return res.status(404).json({ message: "Department not found" })

		department.name = name ?? department.name
		department.description = description ?? department.description

		if (members) {
			// Update members
			const oldMembers = department.members.map((m) => m.toString())
			const newMembers = members

			const removedMembers = oldMembers.filter((id) => !newMembers.includes(id))
			const addedMembers = newMembers.filter(
				(id: string) => !oldMembers.includes(id)
			)

			// Delete department from removed employees
			await Employee.updateMany(
				{ _id: { $in: removedMembers } },
				{ $pull: { departments: department._id } }
			)

			// Add department to new employees
			await Employee.updateMany(
				{ _id: { $in: addedMembers } },
				{ $addToSet: { departments: department._id } }
			)

			// Update department members
			department.members = members
		}

		await department.save()

		res.json(department)
	} catch (error) {
		res.status(500).json({ message: "Error updating department", error })
	}
}
