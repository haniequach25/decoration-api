import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
let testAccount = await nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
  service: "gmail",
//   host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
};

export const sendGmail = async (job) => {

  const { to, subject, message } = job;
  if (to && subject && message && process.env.EMAIL_SENDER) {
    // delivery
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to,
      subject,
      html: message,
    };
    await sendMail(mailOptions);
    return Promise.resolve(true);
  } else {
    return Promise.reject(new Error("No valid email config"));
  }
};
