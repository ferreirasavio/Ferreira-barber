import nodemailer from "nodemailer";

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailArgs) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Ferreira Barber" <${process.env.BREVO_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};