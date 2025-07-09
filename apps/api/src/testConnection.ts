import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

async function testConnection() {
	try {
		await mongoose.connect(process.env.MONGO_URI!)
		console.log("🟢 ¡Conexión exitosa a MongoDB Atlas!")
		process.exit(0)
	} catch (error) {
		console.error("🔴 Error al conectar a MongoDB:", error)
		process.exit(1)
	}
}

testConnection()
