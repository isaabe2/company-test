import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

import employeeRoutes from "./routes/employees"
import departmentRoutes from "./routes/departments"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/employees", employeeRoutes)
app.use("/api/departments", departmentRoutes)

const PORT = process.env.PORT || 3001

mongoose
	.connect(process.env.MONGO_URI!)
	.then(() => {
		console.log("🟢 Connected to MongoDB Atlas")
		app.listen(PORT, () =>
			console.log(`🚀 API running on http://localhost:${PORT}`)
		)
	})
	.catch((err) => {
		console.error("🔴 Error connecting to MongoDB:", err)
	})
