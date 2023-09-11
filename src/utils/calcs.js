const getValuesByBudget = arr => {
  arr.map(budget => {
    if(budget.record !== null){
      budget.spent = budget.record.reduce((acc, elem) => acc + elem.amount, 0);
      budget.free = budget.spent <= budget.amount ? budget.amount - budget.spent : 0;
      budget.progress = budget.spent <= budget.amount ? Math.ceil((budget.spent * 100) / budget.amount) : 100;
      console.log(budget);
    } else {
      budget.spent = 0;
      budget.free = budget.amount;
      budget.progress = 0;
      console.log(budget);
    }
  })
  return arr;
}

module.exports = {
  getValuesByBudget,
}