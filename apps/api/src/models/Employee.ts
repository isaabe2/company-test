import { Schema, model, Document } from "mongoose"

export interface IEmployee extends Document {
	name: string
	email: string
	departments: string[]
}

const EmployeeSchema = new Schema<IEmployee>({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	departments: [{ type: Schema.Types.ObjectId, ref: "Department" }],
})

export const Employee = model<IEmployee>("Employee", EmployeeSchema)
