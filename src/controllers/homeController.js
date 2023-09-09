const db = require('./../config/database');
const models = require('./../models/homeModel');
const jwt = require('jsonwebtoken');

const getBudgets = async (req, res) => {
  const id_person = parseInt(req.query.id);
  let result;

  try {
    result = await db.query(models.getBudgets, [id_person]);
  } catch (err) {
    console.log(err);
    res.status(500).send({msj: 'Error getting budgets'});
  }

  const budgets = result.rows[0].get_all_budgets_by_id_person === null ? [] : result.rows[0].get_all_budgets_by_id_person;
  res.status(200).send({budgets: budgets});
}

const createBudget = async (req, res) => {
  const { token, title, amount } = req.body;
  const person = jwt.verify(token, process.env.JWT_KEY);
  let result;
  try {
    result = await db.query(models.createBudget, [person.id_person, title, amount])
  } catch (err) {
    console.log(err);
    res.status(500).send({msj: 'Problem to create budget'});
  }
  const budget = result.rows[0].create_budget;
  res.status(200).send({msj: 'Budget created successfully', budget: budget});
}

module.exports = {
  getBudgets,
  createBudget
}