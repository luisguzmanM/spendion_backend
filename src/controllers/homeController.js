const { getValuesByBudget } = require('../utils/calcs');
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
  const { id_budget, record } = req.body;
  let result;
  try {
    result = await db.query(models.updateRecord, [id_budget, JSON.stringify(record)]);
  } catch (err) {
    console.log(err);
    res.status(500).send({msj: 'There is a problem to update record'});
  }
  result.rows[0].update_record.record === null ? result.rows[0].update_record.record = [] : '';
  const recordUpdated = result.rows[0].update_record.record;
  res.status(200).send({msj: 'Record updated successfully', record: recordUpdated});
}

const addIncome = async (req, res) => {
  const { token, amount } = req.body;
  const person = jwt.verify(token, process.env.JWT_KEY);
  try {
    const result = await db.query(models.addIncome, [person.id_person, amount]); 
    res.status(200).send({msj: 'Income inserted successfully', income: result.rows[0].income});
  } catch (err) {
    console.log(err);
    res.status(500).send({msj: 'Problem when trying to insert income'});
  }
}

const getIncome = async (req, res) => {
  const token = req.query.token;
  const person = jwt.verify(token, process.env.JWT_KEY);
  let result;
  try {
    result = await db.query(models.getIncome, [person.id_person]);
  } catch (err) {
    console.log(err)
    res.status(500).send({msj: 'Problem trying to get income'});
  }
  res.status(200).send({income: result.rows[0].income});
}

module.exports = {
  getBudgets,
  createBudget,
  deleteBudget,
  updateRecord,
  addIncome,
  getIncome
}