import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

import employeeRoutes from "./routes/employees"
import departmentRoutes from "./routes/departments"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, "../.env") })

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/employees", employeeRoutes)
app.use("/api/departments", departmentRoutes)

console.log("Valor de process.env.PORT:", process.env.PORT)
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
