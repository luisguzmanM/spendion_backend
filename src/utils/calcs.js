const getValuesByBudget = arr => {
  let spent = 0;
  let progress = 0;
  let free = 0;
  arr.map(budget => {
    if(budget.record){
      spent = budget.record.reduce((acc, e) => acc + e.amount, 0);
    }
    progress = budget.amount > spent ? (spent / 100) * budget.amount : 100;
    free = budget.amount > spent ? budget.amount - spent : 0;
    budget.spent = spent;
    budget.progress = progress;
    budget.free = free;
  })
  return arr;
}

module.exports = {
  getValuesByBudget,
}