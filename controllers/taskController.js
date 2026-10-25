const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");

function create(req, res) {
  if (!global.user_id) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const userEmail = global.user_id.email;

  if (!userEmail) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!req.body) req.body = {};

  const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const newTask = {
    id: taskCounter(),
    userId: userEmail,
    ...value,
  };

  if (!Array.isArray(global.tasks)) {
    global.tasks = [];
  }
  global.tasks.push(newTask);

  const { userId, ...sanitizedTask } = newTask;

  res.status(201).json(sanitizedTask);
}

function index(req, res) {
  if (!global.user_id) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const userEmail = global.user_id.email;

  if (!userEmail) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const tasks = global.tasks.filter((task) => {
    return task.userId === userEmail;
  });

  if (tasks.length === 0) {
    return res.status(404).json({ message: "No tasks found" });
  }

  const sanitizedTasks = tasks.map((task) => {
    const { userId, ...sanitizedTask } = task;
    return sanitizedTask;
  });

  res.status(200).json(sanitizedTasks);
}
function show(req, res) {
  if (!global.user_id) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const userEmail = global.user_id.email;
  if (!userEmail) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const task = global.tasks.find(
    task => task.id === taskId && task.userId === userEmail,
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  const { userId, ...sanitizedTask } = task;
  res.status(200).json(sanitizedTask);
}

function update(req, res) {
  if (!global.user_id) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const userEmail = global.user_id.email;

  if (!userEmail) {
    return res.status(401).json({ message: "Authentication required" });
  }
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

  const task = global.tasks.find(
    task => task.id === taskId && task.userId === userEmail,
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  Object.assign(task, value);
  const { userId, ...sanitizedTask } = task;
  res.status(200).json(sanitizedTask);
}

function deleteTask(req, res) {
  if (!global.user_id) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const userEmail = global.user_id.email;
  if (!userEmail) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res
      .status(400)
      .json({ message: "The task ID passed is not valid." });
  }

  const taskIndex = global.tasks.findIndex(
    task => task.id === taskId && task.userId === userEmail,
  );

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  const [deletedTask] = global.tasks.splice(taskIndex, 1);

  const { userId, ...sanitizedTask } = deletedTask;
  res.status(200).json(sanitizedTask);
}

const taskCounter = (() => {
  let lastTaskNumber = 0;
  return () => {
    lastTaskNumber += 1;
    return lastTaskNumber;
  };
})();

module.exports = {
  create,
  index,
  show,
  update,
  deleteTask,
};