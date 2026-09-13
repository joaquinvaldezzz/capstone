import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
  isSensitive?: boolean;
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
  simulated?: boolean;
}

export function getEmailConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM ?? "National Children's Hospital <no-reply@hospital.example>";
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  return { host, port, user, pass, from, appUrl };
}

async function sendEmail({
  to,
  subject,
  text,
  html,
  isSensitive,
}: SendEmailParams): Promise<SendEmailResult> {
  const config = getEmailConfig();

  if (!config.host) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info(`[EMAIL SIMULATION]\nTo: ${to}\nSubject: ${subject}\nBody:\n${text}\n`);
    } else if (isSensitive) {
      // eslint-disable-next-line no-console
      console.info(
        `[EMAIL SIMULATION] Email dispatched to ${to} for subject: ${subject} (content redacted in production)`,
      );
    } else {
      // eslint-disable-next-line no-console
      console.info(`[EMAIL SIMULATION] Email dispatched to ${to} for subject: ${subject}`);
    }
    return { success: true, simulated: true };
  }

  try {
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth:
        config.user && config.pass
          ? {
              user: config.user,
              pass: config.pass,
            }
          : undefined,
    });

    await transport.sendMail({
      from: config.from,
      to,
      subject,
      text,
      html,
    });

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to dispatch email:", error instanceof Error ? error.message : error);
    return { success: false, error: "Failed to dispatch email." };
  }
}

/** Sends a password reset email to the specified recipient with the secure reset link. */
export async function sendPasswordResetEmail({
  to,
  resetToken,
}: {
  to: string;
  resetToken: string;
}): Promise<SendEmailResult> {
  const { appUrl } = getEmailConfig();
  const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

  const subject = "Password Reset Request - National Children's Hospital";
  const text = `Hello,\n\nWe received a request to reset your password for your National Children's Hospital account.\n\nPlease use the link below to set a new password:\n${resetLink}\n\nThis link will expire in 15 minutes.\n\nIf you did not request this password reset, please ignore this email or contact support if you have concerns.\n\nNational Children's Hospital`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px; color: #111827;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <h2 style="color: #1e3a8a; margin-top: 0; margin-bottom: 16px; font-size: 20px;">National Children's Hospital</h2>
    <p style="font-size: 15px; line-height: 1.5; color: #374151; margin-bottom: 20px;">
      Hello,
    </p>
    <p style="font-size: 15px; line-height: 1.5; color: #374151; margin-bottom: 24px;">
      We received a request to reset your password. Click the button below to choose a new password for your account.
    </p>
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 600; font-size: 15px; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
        Reset Password
      </a>
    </div>
    <p style="font-size: 13px; line-height: 1.5; color: #6b7280; margin-bottom: 16px;">
      <strong>Notice:</strong> This link is only valid for <strong>15 minutes</strong>. If you did not request a password reset, you can safely ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="font-size: 12px; color: #9ca3af; margin: 0;">
      If the button above does not work, copy and paste this URL into your browser:<br/>
      <a href="${resetLink}" style="color: #2563eb; word-break: break-all;">${resetLink}</a>
    </p>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, text, html, isSensitive: true });
}

/** Sends a notification email to the patient informing them that their ultrasound result is ready. */
export async function sendResultReadyEmail({
  to,
  patientName,
  resultId,
}: {
  to: string;
  patientName: string;
  resultId: number;
}): Promise<SendEmailResult> {
  const { appUrl } = getEmailConfig();
  const reportUrl = `${appUrl}/patient/result/${resultId}`;

  const subject = "Your Diagnostic Ultrasound Result is Available - National Children's Hospital";
  const text = `Hello ${patientName},\n\nA new ultrasound diagnostic report from your attending physician is now available to view in your patient portal.\n\nPlease review your results at:\n${reportUrl}\n\nIf you have any questions, please reach out to your care team.\n\nNational Children's Hospital`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Diagnostic Ultrasound Result Available</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px; color: #111827;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <h2 style="color: #1e3a8a; margin-top: 0; margin-bottom: 16px; font-size: 20px;">National Children's Hospital</h2>
    <p style="font-size: 15px; line-height: 1.5; color: #374151; margin-bottom: 20px;">
      Hello ${patientName},
    </p>
    <p style="font-size: 15px; line-height: 1.5; color: #374151; margin-bottom: 24px;">
      A new ultrasound diagnostic report from your attending physician is now available for review in the patient portal.
    </p>
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${reportUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 600; font-size: 15px; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
        View Diagnostic Report
      </a>
    </div>
    <p style="font-size: 13px; line-height: 1.5; color: #6b7280; margin-bottom: 16px;">
      For your privacy and security, you may be prompted to log into your patient account before viewing the report.
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="font-size: 12px; color: #9ca3af; margin: 0;">
      If the button above does not work, copy and paste this URL into your browser:<br/>
      <a href="${reportUrl}" style="color: #2563eb; word-break: break-all;">${reportUrl}</a>
    </p>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, text, html, isSensitive: false });
}
