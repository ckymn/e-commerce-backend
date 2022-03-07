module.exports = (err, req, res, next) => {
  res.status(err.status || 500).send({
    status: err.status,
    message: err.message || "Internal Server Error...",
    data: err.data
  });
};
