function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Email, name, and password required" });
  }

  const newUser = {
    email,
    name,
    password,
    tasks: []
  };

  global.users.push(newUser);
  global.user_id = newUser;

  return res.status(201).json({
    name: newUser.name,
    email: newUser.email
  });
}

function logon(req, res) {
  const { email, password } = req.body;

  const matchingUser = global.users.find(user => user.email === email && user.password === password);

  if (!matchingUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  global.user_id = matchingUser;

  return res.status(200).json({
    name: matchingUser.name,
    email: matchingUser.email
  });
}

function logoff(req, res) {
  global.user_id = null;
  return res.status(200).send();
}

module.exports = {
  register,
  logon,
  logoff,
};