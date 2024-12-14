import { MailerSend, EmailParams, Sender, Recipient, Attachment } from 'mailersend';
import { MAILERSEND_API_KEY, MAILERSEND_DOMAIN } from '$env/static/private'
import * as QRCode from 'qrcode';
import * as fs from 'fs/promises';
import * as path from 'path';

// Initialize MailerSend with your API key
const mailerSend = new MailerSend({
  apiKey: MAILERSEND_API_KEY || ''
});

// Define sender information
// Make sure to use an email from your verified domain
const sender = new Sender(`noreply@${MAILERSEND_DOMAIN}`, 'Better Esperia Access');

async function generateQRCodeImage(text: string): Promise<string> {
  try {
    const filePath = path.join(__dirname, 'qrcode.png');
    await QRCode.toFile(filePath, text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return filePath;
  } catch (error) {
    console.error('Error generating QR code image:', error);
    throw error;
  }
}

async function loadEmailTemplate(): Promise<string> {
  try {
    const templatePath = path.join(__dirname, 'template.html');
    const template = await fs.readFile(templatePath, 'utf-8');
    return template;
  } catch (error) {
    console.error('Error loading email template:', error);
    throw error;
  }
}

async function sendMail(userId: string, dest: string, role: string, username: string) {
  let qrCodePath: string | null = null;

  try {
    // Generate QR code image
    qrCodePath = await generateQRCodeImage(userId);

    // Load and populate template
    let htmlContent = await loadEmailTemplate();
    htmlContent = htmlContent
      .replace('{{ROLE}}', role)
      .replace('{{NAME}}', username)

    // Read the QR code file as base64
    const qrCodeBuffer = await fs.readFile(qrCodePath);
    const qrCodeBase64 = qrCodeBuffer.toString('base64');

    // Create recipient
    const recipients = [new Recipient(dest)];

    // Create attachment
    const attachments = [
      new Attachment(
        qrCodeBase64,
        "qrcode.png",
        "inline",
        "qrcode"
      )
    ];

    // Prepare email parameters
    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo(recipients)
      .setSubject('Iscrizione alla Cogestione effettuata!')
      .setHtml(htmlContent)
      .setText(`Iscrizione completata! Il tuo ID utente è: ${userId}`)
      .setAttachments(attachments);

    // Send email
    await mailerSend.email.send(emailParams);

    // Delete the QR code image after sending the email
    if (qrCodePath) {
      await fs.unlink(qrCodePath);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    // Ensure QR code is deleted even if email sending fails
    if (qrCodePath) {
      try {
        await fs.unlink(qrCodePath);
      } catch (deleteError) {
        console.error('Failed to delete QR code image:', deleteError);
      }
    }
    throw error; // Re-throw the original error
  }
}

export { sendMail };