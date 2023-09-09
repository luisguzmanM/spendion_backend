const getBudgets = 'SELECT get_all_budgets_by_id_person($1)';
const getRecord = 'SELECT get_record_by_budget($1)';

module.exports = {
  getBudgets,
  getRecord
}