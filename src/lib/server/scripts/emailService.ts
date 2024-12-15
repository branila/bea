import { MailerSend, EmailParams, Sender, Recipient, Attachment } from 'mailersend';
import { MAILERSEND_API_KEY, MAILERSEND_DOMAIN } from '$env/static/private'
import * as QRCode from 'qrcode';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs/promises';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize MailerSend with your API key
const mailerSend = new MailerSend({
  apiKey: MAILERSEND_API_KEY || ''
});

// Define sender information
const sender = new Sender(`noreply@${MAILERSEND_DOMAIN}`, 'Better Esperia Access');

async function generateQRCodeImage(text: string): Promise<string> {
  try {
    // Generate QR code directly as base64
    return await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
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
  try {
    // Generate QR code as base64 data URL
    const qrCodeDataUrl = await generateQRCodeImage(userId);
    // Extract base64 data from data URL (remove the "data:image/png;base64," prefix)
    const qrCodeBase64 = qrCodeDataUrl.split(',')[1];
    
    // Load and populate template
    let htmlContent = await loadEmailTemplate();
    htmlContent = htmlContent
      .replace('{{ROLE}}', role)
      .replace('{{NAME}}', username)

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
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export { sendMail };