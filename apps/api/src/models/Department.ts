import { Schema, model, Document, Types } from "mongoose"

export interface Hierarchy {
	// Department superior employee ID
	superior?: Types.ObjectId
	// Array of subordinate employee IDs
	subordinates: Types.ObjectId[]
}

export interface IDepartment extends Document {
	name: string
	description?: string
	// The hierarchy is an object with keys being employee IDs
	hierarchy: Record<string, Hierarchy>
}

const DepartmentSchema = new Schema<IDepartment>({
	name: { type: String, required: true },
	description: { type: String },
	hierarchy: {
		type: Object,
		default: {},
	},
})

export const Department = model<IDepartment>("Department", DepartmentSchema)
