# Company Test – Instrucciones de Ejecución

## Ejecutar el proyecto (API + web)

Desde la raíz del proyecto, ejecuta:

### Pasos:

1. Instala dependencias:
   ```sh
   npm install
   ```
2. Configura la conexión a MongoDB Atlas: - Crea un archivo .env en apps/api con:
   MONGODB_URI=tu_uri_de_mongodb
   PORT=3001

3. Inicia ambos servidores:
   npm run dev
   - El API estará disponible en http://localhost:3001/api
   - La web estará disponible en http://localhost:3000

## Environment Variables

- Create a `.env` file in `apps/web/` with the following content:

  NEXT_PUBLIC_API_URL=http://localhost:3001/api

- Create a `.env` file in `apps/api/` with the following content:

  MONGO_URI=mongodb+srv://abeledoisa:Mi%2A170400@cluster0.mnzfrh1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  PORT=3001
