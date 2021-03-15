import config from "@/configs";
const nodemailer = require("nodemailer");

export default nodemailer.createTransport({
  host: config.SMTP.HOST,
  port: config.SMTP.PORT,
  secure: true,
  auth: {
    user: config.SMTP.USER,
    pass: config.SMTP.PASSWORD,
  },
});
