const getPersonByEmail = 'SELECT get_person_by_email($1);';
const signUp = `SELECT create_person($1, $2, $3, $4)`;
const confirmedAccount = `SELECT confirmed FROM public.person WHERE email = $1`
const realConfirmation = `UPDATE public.person SET confirmed = TRUE, token = null WHERE token = $1`;

module.exports = {
  getPersonByEmail,
  signUp,
  confirmedAccount,
  realConfirmation
}