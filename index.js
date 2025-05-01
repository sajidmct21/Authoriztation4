import express from "express";
import env from "dotenv";
import { dbConnection } from "./database-connection/dbConnection.js";
import roleRouter from "./routes/role.router.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.route.js";
import bookRouter from "./routes/book.router.js";
import cors from "cors";

const app = express();
env.config();

app.use(express.json());
app.use(cors());

app.use("/role", roleRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/book", bookRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    name: err.name,
    message: err.message || "Internal Server Error",
    stack: err.stack,
  });
});

const port = 3000;
dbConnection();
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
