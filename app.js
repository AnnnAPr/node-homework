const express = require("express");

const app = express();

app.use(express.json());

global.user_id = null;
global.users = [];
global.tasks = [];

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const userRouter = require("./routes/userRoutes");
app.use('/api/users', userRouter);

app.post("/testpost", (req, res) => {
  res.status(200).json({
    message: "POST route works",
  });
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});

const timeRouter = require("./routes/timeRoutes");
app.use("/api", timeRouter);

const notFound = require("./middleware/not-found");
app.use(notFound);

const errorHandler = require("./middleware/error-handler");
app.use(errorHandler);

module.exports = { app, server };