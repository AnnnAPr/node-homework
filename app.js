const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

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

app.all('/{*splat}', (req, res) => {
  res.status(404).json({
    message: `No route found for ${req.method} ${req.path}`,
  });
});

module.exports = { app, server };