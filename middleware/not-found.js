function notFound(req, res) {
  return res.status(404).json({ message: "Not found" });
}

module.exports = notFound;