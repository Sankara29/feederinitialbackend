import express from "express"
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses JSON requests
 

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});