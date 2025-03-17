import express from "express";
import router from "./routes/router.js";
import cors from "cors";
import dotenv from "dotenv";
import { run } from "./config/databaseConnection.js";
import cookieParser from "cookie-parser";



import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
//Get the filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const ORIGIN = process.env.ORIGIN;
const dbURI = process.env.DB_URI;

console.log(dbURI)
const app = express();
const corsOptions = {
  origin: '*', // Replace with your client origin
  methods: ['GET', 'POST', 'PUT', , "PATCH", 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
///console.log(path.join(__dirname, 'uploads'));



app.use(cors(corsOptions));

// Handle preflight requests for OPTIONS method
app.options('*', cors(corsOptions));

// Connect to the database
try {
  await run(dbURI); // Ensure run() is an async function
} catch (error) {
  console.error('Database connection failed', error);
  process.exit(1); // Exit if the database connection fails
}

// Set up body parsers for handling JSON and URL-encoded data
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);


app.use("*", (req, res) => {
  res.status(404).send("ERROR  404   Page not found!!")
});



app.listen(port, host, (req, res) => {
  console.log(`Server running on Host ${host} Port ${port}...!\n`);
});
