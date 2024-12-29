import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendSignUpVerificationEmail = async (
  toEmail: string,
  verificationCode: string,
) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: "Verify your email with Itineratum",
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email!", error);
    throw error;
  }
};

export const sendAccountPasswordChangedEmail = async (toEmail: string) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: "Password change on Itineratum",
    text: `You have changed your password for your account on Itineratum. No further action is needed from you.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password change email!", error);
    throw error;
  }
};

export const sendAccountDeletedEmail = async (toEmail: string) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: "Itineratum account deleted",
    text: `We are sorry to see you go. If you wish to use Itineratum again, please sign up for a new account.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending account deleted email!", error);
    throw error;
  }
};

export const sendNewsletterSubscribedEmail = async (
  toEmail: string,
  name: string,
) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: "Itineratum newsletter subscribed",
    text: `Dear ${name},\n\nThis email has been subscribed to Itineratum's newsletter!`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending newsletter subscribed email!", error);
    throw error;
  }
};
