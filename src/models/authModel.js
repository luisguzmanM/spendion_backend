const getPersonByEmail = 'SELECT get_person_by_email($1);';
const signUp = `SELECT create_person($1, $2, $3, $4)`;

module.exports = {
  getPersonByEmail,
  signUp
}