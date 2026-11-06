const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");
const prisma = require("../db/prisma");

async function create(req, res) {
  if (!req.body) req.body = {};

  const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: value.title,
        isCompleted: value.isCompleted || false,
        userId: global.user_id,
      },
      select: {
        id: true,
        title: true,
        isCompleted: true,
        createdAt: true,
      },
    });
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function index(req, res) {
  const tasks = await prisma.task.findMany({
    where: {
      userId: global.user_id, // only the tasks for this user!
    },
    select: { title: true, isCompleted: true, id: true },
  });

  if (tasks.length === 0) {
    return res.status(404).json({ message: "No tasks found" });
  }

  res.status(200).json(tasks);
}

async function show(req, res) {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
      userId: global.user_id,
    },
    select: {
      id: true,
      title: true,
      isCompleted: true,
    },
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  return res.status(200).json(task);
}

async function update(req, res, next) {
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

  try {
    const task = await prisma.task.update({
      data: value,
      where: {
        id: taskId,
        userId: global.user_id,
      },
      select: { title: true, isCompleted: true, id: true },
    });
    return res.status(200).json(task);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "The task was not found." });
    } else {
      return next(err); // pass other errors to the global error handler
    }
  }
}

async function deleteTask(req, res) {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res
      .status(400)
      .json({ message: "The task ID passed is not valid." });
  }

  try {
    await prisma.task.delete({
      where: {
        id: taskId,
        userId: global.user_id,
      },
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "The task was not found." });
    }
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