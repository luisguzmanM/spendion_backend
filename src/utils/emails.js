const nodemailer = require('nodemailer');
require('dotenv').config();

// Email para confirmar la cuenta

const emailRegistro = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, name, token } = data;

  // Enlace para confirmar la cuenta
  // const confirmationLink = `https://spendion.app/account-confirmed?token=${token}`;
  const confirmationLink = `http://localhost:4200/account-confirmed?token=${token}`;


  await transport.sendMail({
    from: 'spendion.app',
    to: email,
    subject: 'Confirm your spendion account',
    text: 'Confirm your spendion account',
    html: `
      <p>Hello, ${name} :D</p>
      <p>Please, confirm your spendion account</p>
      <p>
        Your spendion account has been created. Now you just need to confirm your account in the following link: 
        <a href="${confirmationLink}">Confirm account</a>
      </p>
      <small>If you did not create this account, you can ignore this email.</small>
    `
  });
};

module.exports = {
  emailRegistro
};