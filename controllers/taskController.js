const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");
const pool = require("../db/pg-pool");

function toCamelCase(task) {
  if (!task) return task;
  return {
    id: task.id,
    title: task.title,
    isCompleted: task.is_completed,
  };
}

async function create(req, res) {
  if (!req.body) req.body = {};

  const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const result = await pool.query(
    `INSERT INTO tasks (title, is_completed, user_id) 
     VALUES ($1, $2, $3) RETURNING id, title, is_completed`,
    [value.title, value.isCompleted, global.user_id],
  );

  const task = result.rows[0];
  return res.status(201).json(toCamelCase(task));
}

async function index(req, res) {
  const result = await pool.query(
    "SELECT id, title, is_completed FROM tasks WHERE user_id = $1",
    [global.user_id],
  );

  const tasks = result.rows;

  if (tasks.length === 0) {
    return res.status(404).json({ message: "No tasks found" });
  }

  res.status(200).json(tasks.map(toCamelCase));
}

async function show(req, res) {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const result = await pool.query(
    "SELECT id, title, is_completed FROM tasks WHERE id = $1 AND user_id = $2",
    [taskId, global.user_id],
  );

  const task = result.rows[0];
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  return res.status(200).json(toCamelCase(task));
}

async function update(req, res) {
  const taskId = parseInt(req.params?.id);
  if (!taskId) {
    return res
      .status(400)
      .json({ message: "The task ID passed is not valid." });
  }

  if (!req.body) req.body = {};

  const { error, value } = patchTaskSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  let keys = Object.keys(value);
  keys = keys.map((key) => (key === "isCompleted" ? "is_completed" : key));
  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const idParm = `$${keys.length + 1}`;
  const userParm = `$${keys.length + 2}`;
  const result = await pool.query(
    `UPDATE tasks SET ${setClauses} 
  WHERE id = ${idParm} AND user_id = ${userParm} RETURNING id, title, is_completed`,
    [...Object.values(value), taskId, global.user_id],
  );

  const task = result.rows[0];

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  return res.status(200).json(toCamelCase(task));
}

async function deleteTask(req, res) {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res
      .status(400)
      .json({ message: "The task ID passed is not valid." });
  }

  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
    [taskId, global.user_id],
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Task not found." });
  }
  return res.status(200).json({ message: "Task deleted" });
}

module.exports = {
  create,
  index,
  show,
  update,
  deleteTask,
};