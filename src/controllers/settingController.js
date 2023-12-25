const db = require('./../config/database');
const model = require('../models/settingModel');

const updateDataUser = async (req, res) => {
  console.log(req.body);
  const { id_person, fname, lname, photo } = req.body;
  try {
    const userDataUpdated = await db.query(model.updateDataUser, [id_person, fname, lname, photo]);
    console.log(userDataUpdated.rows[0]);
    res.status(200).send({ msj: 'Updated', person: userDataUpdated.rows[0].person });
  } catch (error) {
    res.status(500).send('Error trying to update profile');
  }
}

module.exports = {
  updateDataUser
}