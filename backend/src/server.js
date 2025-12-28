require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT;

const authRouter = require("./routers/auth.router");
const userRouter = require("./routers/user.router");
const taskRouter = require("./routers/task.router");

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} http://localhost:${port}${req.path}`);
  next();
});  

app.use('/auth',authRouter);
app.use('/users',userRouter);
app.use('/tasks',taskRouter);

app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on the server`
  });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});