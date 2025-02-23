const nodemailer = require("nodemailer");

const snedEmail = async (option) => {
  // CREATE TRANSPORTER (actually transporter is a service which send email)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // DEFINE EMAIL OPTIONS
  const emailoptions = {
    from: "Cineflix support <pavanrnri1818@gmail.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transporter.sendMail(emailoptions);
};
// default export
module.exports = snedEmail;
