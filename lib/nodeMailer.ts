import contactsConst from "@/constants/pages/contacts.json";
import endpointsConst from "@/constants/pages/endpoints.json";
import { FeedbackCategory } from "@/constants/types/formData/feedbackFormData";
import nodemailer from "nodemailer";
import urlsConst from "@/constants/urls.json";

const itineratum = "The Itineratum Team";

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
    subject: "Your Itineratum Verification Code",
    text: `Hi,\n\nWelcome to Itineratum! Please use the code below to verify your email and complete your sign-up:\n\n${verificationCode}\n\nThis code will expire in 15 minutes. If you didn't sign up for Itineratum, please ignore this email.\n\nThank you,\n${itineratum}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email!", error);
    throw error;
  }
};

export const sendAccountPasswordChangedEmail = async (
  toEmail: string,
  name: string | null | undefined,
) => {
  const changePasswordLink = `${
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
      ? process.env.HOST_DEV
      : process.env.HOST_PROD
  }/account`;
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: "Password Changed Successfully",
    text: `Hi${name ? " " + name : ""},\n\nYour Itineratum account password was successfully changed. If this was you, no further action is needed.\n\nIf you didn't request a password change, please secure your account immediately by <a href="${changePasswordLink}">clicking here</a> or contacting our support team.\n\nStay secure,\n${itineratum}`,
    html: `
    <p>Hi${name ? " " + name : ""},</p>
    <p>Your Itineratum account password was successfully changed. If this was you, no further action is needed.</p>
    <p>If you didn't request a password change, please secure your account immediately by <a href="${changePasswordLink}" target="_blank">clicking here</a> or contacting our support team.</p>
    <p>Stay secure,<br/>${itineratum}</p>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password change email!", error);
    throw error;
  }
};

export const sendAccountDeletedEmail = async (
  toEmail: string,
  name: string | null | undefined,
) => {
  const feedbackPageLink = `${
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
      ? process.env.HOST_DEV
      : process.env.HOST_PROD
  }/contact-us`;
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: "Your Account Has Been Deleted",
    text: `Hi${name ? " " + name : ""},\n\nWe've successfully processed your request to delete your Itineratum account.\n\nWe're sorry to see you go! If there's anything we could have done to improve your experience, we'd love to hear from you. Simply click <a href="${feedbackPageLink}">clicking here</a> to be directed to our feedback page.\n\n If you ever decide to return, we'll be here to help you plan your adventures\n\nBest wishes,\n${itineratum}`,
    html: `
    <p>Hi${name ? " " + name : ""},</p>
    <p>We’ve successfully processed your request to delete your Itineratum account.</p>
    <p>We're sorry to see you go! If there's anything we could have done to improve your experience, we'd love to hear from you. Simply click <a href="${feedbackPageLink}" target="_blank">here</a> to be redirected to our feedback page.</p>
    <p>If you ever decide to return, we'll be here to help you plan your adventures.</p>
    <p>Best wishes,<br/>${itineratum}</p>
    `,
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
    subject: "You're Subscribed to the Itineratum Newsletter!",
    text: `Hi${name ? " " + name : ""},\n\nThank you for subscribing to the Itineratum newsletter! You'll now receive travel tips, updates, and exclusive offers straight to your inbox.\n\nWe're excited to keep you inspired for your next adventure.\n\nHappy planning,\n${itineratum}`,
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
    subject: "Thank You for Your Feedback!",
    text: `Hi${name ? " " + name : ""},\n\nThank you for sharing your feedback with us! Your thoughts are invaluable in helping us improve Itineratum and enhance your travel planning experience.\n\nIf you have more ideas or questions, feel free to reach out anytime.\n\nCheers,\n${itineratum}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending feedback received email!", error);
    throw error;
  }
};

export const sendItinerary = async (
  toEmail: string,
  name: string | null | undefined,
  itineraryId: string,
) => {
  const host =
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
      ? process.env.HOST_DEV
      : process.env.HOST_PROD;

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: "Your Custom Itinerary is Ready!",
    text: `Hi${name ? " " + name : ""},\n\nYour customised itinerary is ready and waiting here!\n\nClick here to create an account with us and start editing your full itinerary.\n\nWe hope you're excited about your next adventure!\n\nHappy travels,\n${itineratum}`,
    html: `
    <p>Hi${name ? " " + name : ""},</p>
    <p>Your customised itinerary is ready and waiting <a href="${host}/${endpointsConst.itinerary.endpoint}/${itineraryId}" target="_blank">here!</a></p>
    <p><a href="${host}/${endpointsConst.signUp.endpoint}" target="_blank">Click here</a> to create an account with us and start editing your full itinerary.</p>
    <p>We hope you're excited about your next adventure!</p>
    <p>Happy travels,<br/>${itineratum}</p>
    <p><img src="${urlsConst.emailImage}" alt="Email footer image"></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending feedback received email!", error);
    throw error;
  }
};
