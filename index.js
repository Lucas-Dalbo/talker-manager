const express = require('express');
const bodyParser = require('body-parser');
const talkerRouter = require('./routers/talkerRouter');
const middlewares = require('./middlewares');
const generateToken = require('./tokenGenerator');
const tokens = require('./token');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.post('/login',
  middlewares.validateEmailMidd,
  middlewares.validatePasswordMidd,
  (req, res) => {
  const token = generateToken();
  tokens.push(token);
  res.status(200).json({ token });
});

app.use('/talker', talkerRouter);

app.use(middlewares.errorMidd);

app.listen(PORT, () => {
  console.log('Online');
});
