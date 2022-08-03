const express = require('express');
const fs = require('fs');
const middlewares = require('../middlewares');

const router = express.Router();

const readTalkers = () => {
  const result = fs.readFileSync('talker.json');
  const data = JSON.parse(result);
  return data;
};

router.get('/', (_req, res) => {
  const talkers = readTalkers();
  res.status(200).json(talkers);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const talkers = readTalkers();
  const talker = talkers.find((person) => person.id === Number(id));
  if (!talker) {
    throw Error(JSON.stringify(
      { message: 'Pessoa palestrante não encontrada', cod: 404 },
    ));
  }
  return res.status(200).json(talker);
});

router.post('/',
  middlewares.tokenMidd,
  (req, res) => {
  const { name, age, talk } = req.body;
  const talkers = readTalkers();
  const id = talkers.slice(-1)[0].id + 1;
  const newTalker = {
    name,
    age,
    id,
    talk,
  };
  talkers.push(newTalker);
  console.log(talkers);
  res.status(200).json(newTalker);
});

module.exports = router;
