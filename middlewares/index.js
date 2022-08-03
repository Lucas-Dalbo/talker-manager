const tokens = require('../token');

const validateEmailMidd = (req, _res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new Error(JSON.stringify({ message: 'O campo "email" é obrigatório', cod: 400 }));
  }

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email.match(emailRegex)) {
    throw new Error(JSON.stringify(
      { message: 'O "email" deve ter o formato "email@email.com"', cod: 400 },
    ));
  }

  next();
};

const validatePasswordMidd = (req, _res, next) => {
  const { password } = req.body;
  if (!password) {
    throw new Error(JSON.stringify({ message: 'O campo "password" é obrigatório', cod: 400 }));
  }

  if (password.length < 6) {
    throw new Error(JSON.stringify(
      { message: 'O "password" deve ter pelo menos 6 caracteres', cod: 400 },
    ));
  }

  next();
};

const tokenMidd = (req, _res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token || token.length !== 16) {
    throw new Error(JSON.stringify(
      { message: 'Token inválido', cod: 401 },
    ));
  }

  const isValid = tokens.find((key) => key === token);
  if (!isValid) {
    throw new Error(JSON.stringify(
      { message: 'Token não encontrado', cod: 401 },
    ));
  }
  next();
};

const errorMidd = (err, _req, res, _next) => {
  const { message, cod } = JSON.parse(err.message);
  res.status(cod).json({ message });
};

module.exports = {
  errorMidd,
  validateEmailMidd,
  validatePasswordMidd,
  tokenMidd,
};
