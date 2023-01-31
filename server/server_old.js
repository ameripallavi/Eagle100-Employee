import dotenv from "dotenv";
dotenv.config();
import express  from "express";
import morgan from "morgan";
import  dbPool from "./db/config.js"


import { withAuth } from "./middleware/auth.js";
import EmployeeRoute from "./routes/employee/index.js";
import authRouter from "./routes/authentication/index.js";

const PORT =  process.env.PORT;

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use((req,res,next) =>{
    console.log("HTTP Method ." + req.method + " , URL - " +req.url);
    next();
})

app.use("/api/",withAuth,EmployeeRoute);
app.use("/api/auth",authRouter);

app.get('/api/check', async (req, res)=>{
   const result = await dbPool.query('Select Now()');
   return res.send(result)
})

app.listen(PORT, ()=>{
    console.log("Servier is running")
})