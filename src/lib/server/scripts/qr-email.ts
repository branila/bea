import { EmailService } from './emailService';
import * as dotenv from 'dotenv';
import * as QRCode from 'qrcode';
import * as fs from 'fs/promises';
import * as path from 'path';

dotenv.config();

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

async function sendMail(userId: string, dest: string) {
  const emailService = new EmailService();
  let qrCodePath: string | null = null;
  
  try {
    // Generate QR code image
    qrCodePath = await generateQRCodeImage(userId);
    
    // Load and populate template
    let htmlContent = await loadEmailTemplate();
    htmlContent = htmlContent
      .replace('{{QR_CODE}}', 'cid:qrcode')
      .replace('{{USER_ID}}', userId);
    
    // Send email with the QR code as an inline attachment
    await emailService.sendEmail({
      to: dest,
      subject: 'Iscrizione alla Cogestione effettuata!',
      text: `Iscrizione completata! Il tuo ID utente è: ${userId}`,
      html: htmlContent,
      attachments: [
        {
          filename: 'qrcode.png',
          path: qrCodePath,
          cid: 'qrcode'
        }
      ]
    });
    
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