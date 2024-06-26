const getBudgets = 'SELECT get_all_budgets_by_id_person($1)';
const getRecord = 'SELECT get_record_by_budget($1)';
const createBudget = 'SELECT create_budget($1, $2, $3) AS budget';
const deleteBudget = 'SELECT delete_budget($1) budgets';
const updateRecord = 'SELECT update_record($1, $2)';
const addIncome = 'SELECT add_income($1, $2) AS income';
const getIncome = 'SELECT get_income($1) AS income';

module.exports = {
  getBudgets,
  getRecord,
  createBudget,
  deleteBudget,
  updateRecord,
  addIncome,
  getIncome
}