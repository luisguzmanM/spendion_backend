const db = require('./../config/database');
const models = require('./../models/authModels');
require('dotenv').config();
const encryptor = require('simple-encryptor')(process.env.ENCRYPTOR_KEY);
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const encryptedPassword = encryptor.encrypt(password);
  let exists;

  try {
    exists = await db.query(models.getPersonByEmail, [email]);
  } catch (error) {
    console.log(error);
    res.status(500).send({msj: 'There is a problem with checking if person exists'});
  }

  if(exists.rows[0].get_person_by_email !== null){
    res.status(400).send({msj: 'User already exists'});
    return;
  }

  try {
    const result = await db.query(models.signUp, [firstName, lastName, email, encryptedPassword]);
    const token = jwt.sign(result.rows[0].create_person, process.env.JWT_KEY);
    res.status(200).send({msj: 'Signup successfull', person: result.rows[0].create_person, token: token});
  } catch (error) {
    console.log(error);
    res.status(500).send('There is a signup problem');
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  let exists;

  try {
    exists = await db.query(models.getPersonByEmail, [email]);
  } catch (error) {
    console.log(error);
  }

  if(exists.rows[0].get_person_by_email === null){
    res.status(400).send({msj: 'User do not exists'});
    return;
  }

  const decryptedPassword = encryptor.decrypt(exists.rows[0].get_person_by_email.phash);

  const person = {
    fname: exists.rows[0].get_person_by_email.fname,
    lname: exists.rows[0].get_person_by_email.lname,
    email: exists.rows[0].get_person_by_email.email,
    id_person: exists.rows[0].get_person_by_email.id_person
  }

  const token = jwt.sign(person, process.env.JWT_KEY);

  decryptedPassword !== password 
  ? res.status(400).send({msj: 'Wrong password'})
  : res.status(200).send({msj: 'Login successfull', person: person, token: token})
}

module.exports = {
  signup,
  login
}