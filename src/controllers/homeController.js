const db = require('./../config/database');
const models = require('./../models/homeModel');

const getBudgets = (req, res) => {
  const id_person = req.params.id_person;
  console.log(id_person)
  res.status(200).send(id_person)
}

module.exports = {
  getBudgets,
}