import { Request, Response } from "express"
import { Employee } from "../models/Employee"

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
	try {
		const { name, email, position, departments, hierarchy } = req.body
		const employee = new Employee({
			name,
			email,
			position,
			departments: departments || [],
			hierarchy: hierarchy || {},
		})
		await employee.save()

		// If departments are provided, add this employee to each department's members
		if (departments && departments.length > 0) {
			const Department = require("../models/Department").Department
			await Department.updateMany(
				{ _id: { $in: departments } },
				{ $addToSet: { members: employee._id } }
			)
		}
		res.status(201).json(employee)
	} catch (error) {
		res.status(500).json({ message: "Error creating employee", error })
	}
}

// Get all employees
export const getEmployees = async (_req: Request, res: Response) => {
	try {
		const employees = await Employee.find()
		res.json(employees)
	} catch (error) {
		res.status(500).json({ message: "Error fetching employees", error })
	}
}

// Get employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
	try {
		const employee = await Employee.findById(req.params.id).populate(
			"departments"
		)
		if (!employee)
			return res.status(404).json({ message: "Employee not found" })
		res.json(employee)
	} catch (error) {
		res.status(500).json({ message: "Error fetching employee", error })
	}
}

// Edit employee by ID
export const updateEmployee = async (req: Request, res: Response) => {
	try {
		const { name, email, position } = req.body
		const employee = await Employee.findByIdAndUpdate(
			req.params.id,
			{ name, email, position },
			{ new: true }
		)
		if (!employee)
			return res.status(404).json({ message: "Employee not found" })
		res.json(employee)
	} catch (error) {
		res.status(500).json({ message: "Error updating employee", error })
	}
}
