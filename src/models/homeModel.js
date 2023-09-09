const getBudgets = 'SELECT get_all_budgets_by_id_person($1)';
const getRecord = 'SELECT get_record_by_budget($1)';
const createBudget = 'SELECT create_budget($1, $2, $3)';

module.exports = {
  getBudgets,
  getRecord,
  createBudget
}