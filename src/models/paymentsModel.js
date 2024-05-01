const upgradePlan = 'UPDATE suscription_by_person SET id_suscription = 2 WHERE id_person = $1';
const getUserById = 'SELECT fname, lname, email FROM person WHERE id_person = $1';

module.exports = {
  upgradePlan,
  getUserById
}