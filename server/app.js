import dotenv from "dotenv";
dotenv.config();
import express  from "express";
import morgan from "morgan";

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(morgan("dev"));

import { withAuth } from "./middleware/auth.js";
import authRouter from "./routes/authentication/index.js";
import employeesRouter from "./routes/employee/index.js";


app.use('/api/auth',authRouter);
app.use('/api/employees',withAuth,employeesRouter);

app.listen(port, () => console.log(`Server listening on port ${port}!`));