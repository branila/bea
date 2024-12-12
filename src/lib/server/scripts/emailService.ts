import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    path?: string; // File path
    content?: Buffer | string; // Inline content
    cid?: string; // Content-ID for inline attachments
  }[];
}


export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Gmail SMTP configuration
    this.transporter = nodemailer.createTransport({
      service: 'gmail',  // Using 'gmail' as service automatically sets host and port
      auth: {
        user: process.env.GMAIL_USER,
        // Use App Password, not your regular Gmail password!
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      // Optional: Enable additional security features
      tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // Verify SMTP connection configuration
      await this.transporter.verify();

      const mailOptions: nodemailer.SendMailOptions = {
        from: {
          name: process.env.SENDER_NAME || 'Your Name',
          address: process.env.GMAIL_USER || ''
        },
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments, // Attachments are passed here
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }


}