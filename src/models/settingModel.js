const updateDataUser = `SELECT * FROM update_person($1, $2, $3, $4) AS person`;

module.exports = {
  updateDataUser
}