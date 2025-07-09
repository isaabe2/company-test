import { Schema, model, Document } from "mongoose"

export interface IDepartment extends Document {
	name: string
	description?: string
	// Array of employee IDs that are members of this department
	members: Schema.Types.ObjectId[]
}

const DepartmentSchema = new Schema<IDepartment>({
	name: { type: String, required: true },
	description: { type: String },
	members: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
})

export const Department = model<IDepartment>("Department", DepartmentSchema)
