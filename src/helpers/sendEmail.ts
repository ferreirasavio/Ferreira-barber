import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY não configurada");
  }

  await resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL || "Ferreira Barber <no-reply@resend.dev>",
    to,
    subject,
    html,
  });
}
