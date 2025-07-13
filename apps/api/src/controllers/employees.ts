import mongoose from "mongoose"
import { Request, Response } from "express"
import { Employee } from "../models/Employee"
import { Department } from "../models/Department"

// Create employee
export const createEmployee = async (req: Request, res: Response) => {
	try {
		const { name, email, departments } = req.body
		if (!name || !email) {
			return res.status(400).json({ message: "Name and email are required" })
		}
		if (
			!departments ||
			!Array.isArray(departments) ||
			departments.length === 0
		) {
			return res
				.status(400)
				.json({ message: "At least one department is required" })
		}
		const departmentIds = departments
			.filter((id: any) => !!id)
			.map((id: any) =>
				typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
			)
		const employee = new Employee({
			name,
			email,
			departments: departmentIds,
		})
		await employee.save()
		res.status(201).json(employee)
	} catch (error) {
		res.status(500).json({ message: "Error creating employee", error })
	}
}

// Get all employees
export const getEmployees = async (_req: Request, res: Response) => {
	try {
		const employees = await Employee.find().lean()
		res.json(employees)
	} catch (error) {
		res.status(500).json({ message: "Error getting employees", error })
	}
}

//Get employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
	try {
		const employee = await Employee.findById(req.params.id)

		if (!employee) {
			return res.status(404).json({ message: "Employee not found" })
		}
		res.json(employee)
	} catch (error) {
		res.status(500).json({ message: "Error getting employee", error })
	}
}

// Update employee by ID
export const updateEmployee = async (req: Request, res: Response) => {
	try {
		const { name, email, departments, department } = req.body
		const employee = await Employee.findById(req.params.id)
		if (!employee)
			return res.status(404).json({ message: "Employee not found" })

		if (name !== undefined && !name) {
			return res.status(400).json({ message: "Name cannot be empty" })
		}
		if (email !== undefined && !email) {
			return res.status(400).json({ message: "Email cannot be empty" })
		}

		employee.name = name ?? employee.name
		employee.email = email ?? employee.email

		if (departments) {
			if (!Array.isArray(departments) || departments.length === 0) {
				return res
					.status(400)
					.json({ message: "At least one department is required" })
			}
			employee.departments = departments
				.filter((id: any) => !!id)
				.map((id: any) =>
					typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
				)
		} else if (department) {
			employee.departments = [
				typeof department === "string"
					? new mongoose.Types.ObjectId(department)
					: department,
			]
		}

		await employee.save()
		res.json(employee)
	} catch (error) {
		res.status(500).json({ message: "Error updating employee", error })
	}
}

// Delete employee by ID
export const deleteEmployee = async (req: Request, res: Response) => {
	try {
		const employee = await Employee.findByIdAndDelete(req.params.id)
		if (!employee) {
			return res.status(404).json({ message: "Employee not found" })
		}
		res.json({ message: "Employee deleted successfully", _id: req.params.id })
	} catch (error) {
		res.status(500).json({ message: "Error deleting employee", error })
	}
}

// Get detailed info for one employee
export const getEmployeeDetails = async (req: Request, res: Response) => {
	try {
		const employee = await Employee.findById(req.params.id)
			.populate("departments")
			.lean()
		if (!employee) {
			return res.status(404).json({ message: "Employee not found" })
		}
		const empId = employee._id.toString()
		const allEmployees = await Employee.find().lean()
		const employeeMap = Object.fromEntries(
			allEmployees.map((e: any) => [e._id.toString(), e.name])
		)
		const details = employee.departments.map((department: any) => {
			const superiorId = department.hierarchy[empId] || null
			const superior = superiorId
				? { _id: superiorId, name: employeeMap[superiorId] || "Unknown" }
				: null
			const subordinates = Object.entries(department.hierarchy)
				.filter(([id, supId]) => supId === empId)
				.map(([id]) => ({ _id: id, name: employeeMap[id] || "Unknown" }))
			return {
				_id: department._id.toString(),
				name: department.name,
				superior,
				subordinates,
			}
		})
		res.json({
			_id: employee._id,
			name: employee.name,
			email: employee.email,
			departments: details,
		})
	} catch (error) {
		res.status(500).json({ message: "Error getting employee details", error })
	}
}
