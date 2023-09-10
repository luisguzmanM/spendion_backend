const { getValuesByBudget } = require('../utils/calcs');
const { generarID } = require('../utils/token');
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

  let budgets = result.rows[0].get_all_budgets_by_id_person === null ? [] : result.rows[0].get_all_budgets_by_id_person;
  budgets = getValuesByBudget(budgets);

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

const deleteBudget = async (req, res) => {
  const id_budget = req.query.id_budget;
  try {
    await db.query(models.deleteBudget, [id_budget]);
  } catch (err) {
    console.log(err);
    res.status(500).send({msj: 'Error removing budget'});
  }
  res.status(200).send({msj: 'Budget deleted successfully'});
}

const updateRecord = async (req, res) => {
  const { title, amount, id_budget } = req.body;
  const result = await db.query(models.getRecord, [id_budget]);
  const currentRecord = result.rows[0].get_record_by_budget;
  const obj = {
    id: generarID(),
    title: title,
    amount: amount
  }
  currentRecord.push(obj);
  const results = await db.query(models.updateRecord, [id_budget, JSON.stringify(currentRecord)]);
  const newResult = resutls.rows[0].update_record;
  console.log(newResult)
  res.status(200).send({record:currentRecord})
}

module.exports = {
  getBudgets,
  createBudget,
  deleteBudget,
  updateRecord
}