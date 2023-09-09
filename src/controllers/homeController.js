const db = require('./../config/database');
const models = require('./../models/homeModel');

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

module.exports = {
  getBudgets,
}