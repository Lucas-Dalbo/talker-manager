const tokens = require('../token');

const validateName = (name) => {
  if (!name) {
    throw new Error(JSON.stringify(
      { message: 'O campo "name" é obrigatório', cod: 400 },
    ));
  }
  if (name.length < 3) {
    throw new Error(JSON.stringify(
      { message: 'O "name" deve ter pelo menos 3 caracteres', cod: 400 },
    ));
  }
};

const validateAge = (age) => {
  if (!age) {
    throw new Error(JSON.stringify(
      { message: 'O campo "age" é obrigatório', cod: 400 },
    ));
  }
  if (age < 18) {
    throw new Error(JSON.stringify(
      { message: 'A pessoa palestrante deve ser maior de idade', cod: 400 },
    ));
  }
};

const validateTalkAndWatched = (talk) => {
  if (!talk) {
    throw new Error(JSON.stringify(
      { message: 'O campo "talk" é obrigatório', cod: 400 },
    ));
  }
  const { watchedAt } = talk;
  if (!watchedAt) {
    throw new Error(JSON.stringify(
      { message: 'O campo "watchedAt" é obrigatório', cod: 400 },
    ));
  }
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!watchedAt.match(dateRegex)) {
    throw new Error(JSON.stringify(
      { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"', cod: 400 },
    ));
  }
};

const validadeRate = (talk) => {
  const { rate } = talk;
  if (!rate) {
    throw new Error(JSON.stringify(
      { message: 'O campo "rate" é obrigatório', cod: 400 },
    ));
  }
  if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
    throw new Error(JSON.stringify(
      { message: 'O campo "rate" deve ser um inteiro de 1 à 5', cod: 400 },
    ));
  }
};

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
  if (!token) {
    throw new Error(JSON.stringify({ message: 'Token não encontrado', cod: 401 }));
  }
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

const postTalkerMidd = (req, _res, next) => {
  const { name, age, talk } = req.body;
  validateName(name);
  validateAge(age);
  validateTalkAndWatched(talk);
  validadeRate(talk);
  next();
};

module.exports = {
  errorMidd,
  validateEmailMidd,
  validatePasswordMidd,
  tokenMidd,
  postTalkerMidd,
};
