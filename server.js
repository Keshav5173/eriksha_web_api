// Import Libraries and files
import express from "express"
import 'dotenv/config'
import {connectDb} from "./src/config/db.js"
import e_Riksha_router from "./src/routes/e-riksha.routes.js"  
import cors from "cors";

const app = express();

// Allows cors
app.use(cors());

// Connect to MongoDB
connectDb();

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// API Routes
app.use("/eriksha", e_Riksha_router);


//Server Port
const port = process.env.PORT;

//Start Server
app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
})