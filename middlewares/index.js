const errorMidd = (err, _req, res, _next) => {
  const { message, cod } = JSON.parse(err.message);
  res.status(cod).json({ message });
};

module.exports = {
  errorMidd,
};
