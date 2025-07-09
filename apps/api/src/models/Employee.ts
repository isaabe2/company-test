import { Schema, model, Document } from "mongoose"

interface Hierarchy {
	// Department superior employee ID
	superior?: Schema.Types.ObjectId
	// Array of subordinate employee IDs
	subordinates: Schema.Types.ObjectId[]
}

export interface IEmployee extends Document {
	name: string
	email: string
	position: string
	// Array of department IDs the employee belongs to
	departments: Schema.Types.ObjectId[]
	// Map of department IDs to their hierarchy
	hierarchy: Map<string, Hierarchy>
}

const HierarchySchema = new Schema<Hierarchy>(
	{
		superior: { type: Schema.Types.ObjectId, ref: "Employee" },
		subordinates: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
	},
	{ _id: false }
)

const EmployeeSchema = new Schema<IEmployee>({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	position: { type: String, required: true },
	departments: [{ type: Schema.Types.ObjectId, ref: "Department" }],
	hierarchy: {
		type: Map,
		of: HierarchySchema,
		default: {},
	},
})

export const Employee = model<IEmployee>("Employee", EmployeeSchema)
