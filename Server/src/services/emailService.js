import nodemailer from 'nodemailer';
import { Inquiry } from '../models/Inquiry.js';

/**
 * Configure Nodemailer transport with Gmail SMTP support
 */
export const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const secure = process.env.EMAIL_SECURE === 'true' || port === 465;
  const user = process.env.EMAIL_USER || 'cydexdigital@gmail.com';
  const pass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').replace(/\s+/g, '').trim();

  if (!pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure, // false for port 587 (STARTTLS), true for port 465
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
    connectionTimeout: 10000,
    greetingTimeout: 7000,
    socketTimeout: 15000,
  });
};

/**
 * Diagnoses and verifies the SMTP connection without exposing sensitive credentials
 *
 * @returns {Promise<{ configured: boolean, host: string, port: number, secure: boolean, user: string, recipient: string, hasPass: boolean, passLength: number, verified: boolean, message: string, error?: string }>}
 */
export const verifySmtpConfig = async () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const secure = process.env.EMAIL_SECURE === 'true' || port === 465;
  const user = process.env.EMAIL_USER || 'cydexdigital@gmail.com';
  const pass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').replace(/\s+/g, '').trim();
  const recipient = process.env.INQUIRY_NOTIFICATION_EMAIL || 'cydexdigital@gmail.com';

  const diagnostics = {
    configured: Boolean(pass),
    host,
    port,
    secure,
    user,
    recipient,
    hasPass: Boolean(pass),
    passLength: pass ? pass.length : 0,
    verified: false,
    message: '',
  };

  if (!pass) {
    diagnostics.message =
      'EMAIL_PASS is not configured in Server/.env. SMTP credentials missing. Inquiries will be safely stored in MongoDB but email dispatch will be skipped until a Gmail App Password is provided.';
    return diagnostics;
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    diagnostics.verified = true;
    diagnostics.message = `SMTP connection verified successfully to ${host}:${port} for ${user}.`;
    return diagnostics;
  } catch (err) {
    diagnostics.verified = false;
    diagnostics.error = err.message;
    diagnostics.message = `SMTP verification failed: ${err.message}`;
    return diagnostics;
  }
};

/**
 * Sends a structured project inquiry notification email to CYDEX DIGITAL
 *
 * @param {Object} inquiry - The saved MongoDB Inquiry document
 * @param {number} [retryCount=0] - Internal retry counter
 * @returns {Promise<{ success: boolean, messageId?: string, skipped?: boolean, error?: string }>}
 */
export const sendInquiryNotification = async (inquiry, retryCount = 0) => {
  const inquiryId = inquiry._id;
  const referenceId = inquiry.referenceId || inquiryId;
  const recipient = process.env.INQUIRY_NOTIFICATION_EMAIL || 'cydexdigital@gmail.com';
  const sender = process.env.EMAIL_USER || 'cydexdigital@gmail.com';

  try {
    const transporter = createTransporter();

    // 1. If credentials are not set, record 'skipped' safely on the MongoDB inquiry
    if (!transporter) {
      const skipReason =
        'EMAIL_PASS is not configured in Server/.env. Inquiries are safely preserved in MongoDB, but email dispatch requires a Gmail App Password.';
      console.warn(
        `[EmailService] ⚠️ SMTP Notice: EMAIL_PASS not configured. Skipped email notification for inquiry ${referenceId}.`
      );

      await Inquiry.findByIdAndUpdate(inquiryId, {
        $set: {
          'emailNotification.status': 'skipped',
          'emailNotification.recipient': recipient,
          'emailNotification.error': skipReason,
          'emailNotification.lastAttemptAt': new Date(),
        },
        $inc: { 'emailNotification.attempts': 1 },
      }).catch((e) => console.error('[EmailService] Failed to update inquiry status:', e.message));

      return { success: false, skipped: true, message: skipReason };
    }

    // 2. Format details
    const timestamp = inquiry.createdAt
      ? new Date(inquiry.createdAt).toUTCString()
      : new Date().toUTCString();

    const subject = 'New Project Inquiry Received — CYDEX DIGITAL';

    // Validate replyTo email format before assigning
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanReplyTo = inquiry.email && emailRegex.test(inquiry.email.trim())
      ? inquiry.email.trim()
      : sender;

    const plainText = `
New Project Inquiry Received — CYDEX DIGITAL

A new inquiry has been submitted via the website contact form.

REFERENCE ID: ${referenceId}
DATE & TIME: ${timestamp}

CLIENT DETAILS:
- Full Name: ${inquiry.name}
- Email: ${inquiry.email}
- Phone: ${inquiry.phone || 'Not provided'}
- Company: ${inquiry.company || 'Not provided'}
- Preferred Contact: ${inquiry.preferredContactMethod || 'Email'}

PROJECT SPECIFICATIONS:
- Service Requested: ${inquiry.service}
- Project Title: ${inquiry.projectTitle}
- Budget Range: ${inquiry.budgetRange || 'Flexible'}
- Target Timeline: ${inquiry.timeline || 'Flexible'}

PROJECT DETAILS / REQUIREMENTS:
${inquiry.details}

---
Admin Dashboard: ${process.env.FRONTEND_URL || 'https://cydexdigital.com'}/admin/inquiries/${inquiryId}
CYDEX DIGITAL Automated Dispatch System
`.trim();

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #040E12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; line-height: 1.6;">
  <div style="max-width: 640px; margin: 0 auto; background-color: #08181F; border: 1px solid #143542; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background-color: #06161B; padding: 28px 32px; border-bottom: 2px solid #0AE3DA;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: #FFFFFF;">
        CYDEX<span style="color: #0AE3DA;">.</span>
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #0AE3DA; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">
        New Project Inquiry Received
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">
      
      <!-- Alert Badge / Ref ID -->
      <div style="background: rgba(10, 227, 218, 0.08); border: 1px solid rgba(10, 227, 218, 0.25); border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #0AE3DA; font-weight: 600;">
          Reference ID
        </div>
        <div style="font-size: 16px; font-weight: 700; color: #FFFFFF; font-family: monospace; margin-top: 4px;">
          ${referenceId}
        </div>
        <div style="font-size: 12px; color: #9CA3AF; margin-top: 4px;">
          Received: ${timestamp}
        </div>
      </div>

      <!-- Client Info Section -->
      <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.06em; color: #9CA3AF; margin: 0 0 12px 0; border-bottom: 1px solid #143542; padding-bottom: 6px;">
        Client Information
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #9CA3AF; width: 35%;">Client Name:</td>
          <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${inquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9CA3AF;">Email Address:</td>
          <td style="padding: 8px 0; color: #0AE3DA; font-weight: 600;">
            <a href="mailto:${inquiry.email}" style="color: #0AE3DA; text-decoration: none;">${inquiry.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9CA3AF;">Phone Number:</td>
          <td style="padding: 8px 0; color: #FFFFFF;">${inquiry.phone || '<em style="color:#6B7280">Not provided</em>'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9CA3AF;">Company / Brand:</td>
          <td style="padding: 8px 0; color: #FFFFFF;">${inquiry.company || '<em style="color:#6B7280">Not provided</em>'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9CA3AF;">Preferred Contact:</td>
          <td style="padding: 8px 0; color: #FFFFFF;">${inquiry.preferredContactMethod || 'Email'}</td>
        </tr>
      </table>

      <!-- Project Requirements Section -->
      <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.06em; color: #9CA3AF; margin: 0 0 12px 0; border-bottom: 1px solid #143542; padding-bottom: 6px;">
        Project Specifications
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #9CA3AF; width: 35%;">Requested Service:</td>
          <td style="padding: 8px 0; color: #0AE3DA; font-weight: 600;">${inquiry.service}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9CA3AF;">Project Title:</td>
          <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${inquiry.projectTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9CA3AF;">Budget Range:</td>
          <td style="padding: 8px 0; color: #FFFFFF;">${inquiry.budgetRange || 'Flexible'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9CA3AF;">Target Timeline:</td>
          <td style="padding: 8px 0; color: #FFFFFF;">${inquiry.timeline || 'Flexible'}</td>
        </tr>
      </table>

      <!-- Detailed Description -->
      <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.06em; color: #9CA3AF; margin: 0 0 12px 0; border-bottom: 1px solid #143542; padding-bottom: 6px;">
        Scope & Project Details
      </h2>
      <div style="background-color: #06161B; border: 1px solid #143542; border-radius: 8px; padding: 18px; margin-bottom: 28px; white-space: pre-wrap; font-size: 14px; color: #E5E7E7; line-height: 1.7;">
${inquiry.details}
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-top: 10px;">
        <a href="mailto:${inquiry.email}?subject=Re:%20Inquiry%20${encodeURIComponent(referenceId)}%20%E2%80%94%20CYDEX%20DIGITAL"
           style="display: inline-block; background-color: #0AE3DA; color: #040E12; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 6px;">
          Reply to Client Directly
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #06161B; padding: 20px 32px; border-top: 1px solid #143542; text-align: center; font-size: 12px; color: #6B7280;">
      <p style="margin: 0;">CYDEX DIGITAL | Automated Inquiry Dispatch System</p>
      <p style="margin: 4px 0 0 0; color: #4B5563;">This notification was generated automatically upon visitor form submission.</p>
    </div>

  </div>
</body>
</html>
`.trim();

    // 3. Dispatch email
    const info = await transporter.sendMail({
      from: `"CYDEX DIGITAL Inquiries" <${sender}>`,
      to: recipient,
      replyTo: cleanReplyTo,
      subject,
      text: plainText,
      html: htmlBody,
    });

    console.log(
      `[EmailService] ✅ Email delivered to ${recipient} for inquiry ${referenceId} (MessageId: ${info.messageId})`
    );

    // 4. Update inquiry document with success
    await Inquiry.findByIdAndUpdate(inquiryId, {
      $set: {
        'emailNotification.status': 'sent',
        'emailNotification.recipient': recipient,
        'emailNotification.messageId': info.messageId,
        'emailNotification.sentAt': new Date(),
        'emailNotification.error': null,
        'emailNotification.lastAttemptAt': new Date(),
      },
      $inc: { 'emailNotification.attempts': 1 },
    });

    return { success: true, status: 'sent', messageId: info.messageId };
  } catch (error) {
    console.error(
      `[EmailService] ❌ Delivery attempt ${retryCount + 1} failed for ${referenceId}:`,
      error.message
    );

    // Retry once on transient network errors
    if (retryCount < 1) {
      console.log(`[EmailService] Retrying delivery in 2000ms for ${referenceId}...`);
      await new Promise((r) => setTimeout(r, 2000));
      return sendInquiryNotification(inquiry, retryCount + 1);
    }

    // Record failure safely on the inquiry
    await Inquiry.findByIdAndUpdate(inquiryId, {
      $set: {
        'emailNotification.status': 'failed',
        'emailNotification.recipient': recipient,
        'emailNotification.error': error.message,
        'emailNotification.lastAttemptAt': new Date(),
      },
      $inc: { 'emailNotification.attempts': 1 },
    }).catch((e) => console.error('[EmailService] Failed to record failure state:', e.message));

    return { success: false, status: 'failed', error: error.message };
  }
};
