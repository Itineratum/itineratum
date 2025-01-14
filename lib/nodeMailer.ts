import contactsConst from "@/constants/pages/contacts.json";
import { FeedbackCategory } from "@/constants/types/formData/feedbackFormData";
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

export const sendFeedbackEmailNotification = async (
  userEmail: string | null | undefined,
  userName: string | null | undefined,
  rating: number,
  feedbackCategory: FeedbackCategory,
  thoughtsSuggestions: string,
  fileUrls: string[],
) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: contactsConst.email,
    subject: "[NOTIF]: New feedback received",
    text: `Feedback received\n\nUser Email: ${userEmail ?? ""}\nUser Name: ${userName ?? ""}\nRating: ${rating}\nFeedback Category: ${feedbackCategory}\nThoughts or Suggestions: ${thoughtsSuggestions}\nUploaded files: ${fileUrls.map((fileUrl) => `\n- ${fileUrl}`)}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending newsletter subscribed email!", error);
    throw error;
  }
};

export const sendFeedbackReceivedEmail = async (
  toEmail: string,
  name: string | null | undefined,
) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: "Your feeback to Itineratum has been received",
    text: `Dear ${name ?? ""},\n\nThank you for your feedback, we will review your feedback and take any necessary actions. Thank you for using Itineratum!`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending feedback received email!", error);
    throw error;
  }
};
