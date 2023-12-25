const db = require('./../config/database');
const model = require('../models/authModel');
require('dotenv').config();
const encryptor = require('simple-encryptor')(process.env.ENCRYPTOR_KEY);
const jwt = require('jsonwebtoken');
const emails = require('./../utils/emails');
const tokenConfirm = require('./../utils/token');

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const encryptedPassword = encryptor.encrypt(password);
  const tokenConfirmation = tokenConfirm.generarID()
  let exists;

  try {
    exists = await db.query(model.getPersonByEmail, [email]);
  } catch (error) {
    console.log(error);
    res.status(500).send({msj: 'There is a problem with checking if person exists'});
  }

  if(exists.rows[0].get_person_by_email !== null){
    res.status(400).send({msj: 'User already exists'});
    return;
  }

  try {
    await db.query(model.signUp, [firstName, lastName, email, encryptedPassword, tokenConfirmation]);

    emails.emailRegistro({
      name: firstName,
      email: email,
      token: tokenConfirmation
    })

    res.status(200).send({msj: 'Signup successfull'});
  } catch (error) {
    console.log(error);
    res.status(500).send('There is a signup problem');
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  let exists;

  try {
    exists = await db.query(model.getPersonByEmail, [email]);
    confirmed = await db.query(model.confirmedAccount, [email]);
  } catch (error) {
    console.log(error);
  }

  if(exists.rows[0].get_person_by_email === null){
    res.status(400).send({msj: 'User do not exists'});
    return;
  }

  if(confirmed.rows[0].confirmed === false){
    res.status(400).send({msj: 'You need to confirm your account. Please, check your email.'});
    return;
  }

  const decryptedPassword = encryptor.decrypt(exists.rows[0].get_person_by_email.phash);

  const person = {
    fname: exists.rows[0].get_person_by_email.fname,
    lname: exists.rows[0].get_person_by_email.lname,
    email: exists.rows[0].get_person_by_email.email,
    id_person: exists.rows[0].get_person_by_email.id_person,
    confirmed: exists.rows[0].get_person_by_email.confirmed,
    created: exists.rows[0].get_person_by_email.created,
    flg_premium: exists.rows[0].get_person_by_email.flg_premium
  }

  console.log(person);

  const token = jwt.sign(person, process.env.JWT_KEY);

  decryptedPassword !== password 
  ? res.status(400).send({msj: 'Wrong password'})
  : res.status(200).send({msj: 'Login successfull', person: person, token: token})
}

const confirmation = async (req, res) => {
  console.log('Begin account confirmation ------>');
  const token = req.body.token;
  try {
    const confirmation = await db.query(model.realConfirmation, [token]);
    console.log('Account confirmation -----> ', confirmation);
    res.status(200).send({msj: 'Account confirmed successfully'});
  } catch (error) {
    res.status(500).send('Error trying to confirm account');
  }
}

module.exports = {
  signup,
  confirmation,
  login
}