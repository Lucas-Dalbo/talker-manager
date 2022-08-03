const express = require('express');
const fs = require('fs');
const middlewares = require('../middlewares');

const router = express.Router();

const readTalkers = () => {
  const result = fs.readFileSync('talker.json');
  const data = JSON.parse(result);
  return data;
};

const findTalker = (id) => {
  const talkers = readTalkers();
  const talker = talkers.find((person) => person.id === Number(id));
  if (!talker) {
    throw Error(JSON.stringify(
      { message: 'Pessoa palestrante não encontrada', cod: 404 },
    ));
  }
  return talker;
};

const makeTalker = (name, age, id, talk) => ({ name, age, id, talk });

router.get('/', (_req, res) => {
  const talkers = readTalkers();
  res.status(200).json(talkers);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const talker = findTalker(id); 
  return res.status(200).json(talker);
});

router.post('/',
  middlewares.tokenMidd,
  middlewares.postTalkerMidd,
  (req, res) => {
  const { name, age, talk } = req.body;
  const talkers = readTalkers();
  const id = talkers.slice(-1)[0].id + 1;
  const newTalker = makeTalker(name, age, id, talk);
  const newList = [...talkers, newTalker];
  fs.writeFileSync('talker.json', JSON.stringify(newList));
  res.status(201).json(newTalker);
});

router.put('/:id',
  middlewares.tokenMidd,
  middlewares.postTalkerMidd,
  (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talker = findTalker(id);
  const newInfo = makeTalker(name, age, Number(id), talk);
  const attTalker = { ...talker[0], ...newInfo };
  const talkers = readTalkers();
  const newList = [...talkers, attTalker];
  fs.writeFileSync('talker.json', JSON.stringify(newList));
  res.status(200).json(attTalker);
});

router.delete('/:id', middlewares.tokenMidd, (req, res) => {
  const { id } = req.params;
  const talkers = readTalkers();
  const newList = talkers.filter((pers) => pers.id !== Number(id));
  fs.writeFileSync('talker.json', JSON.stringify(newList));
  res.status(204).end();
});

module.exports = router;
