import * as nodemailer from 'nodemailer'
import * as QRCode from 'qrcode'
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PSW
} from '$env/static/private'

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PSW
  }
})

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
    })
  } catch (error) {
    console.error('Error generating QR code image:', error)
    throw error
  }
}

async function sendMail(userId: string, dest: string, role: string, username: string) {
  try {
    // Generate QR code as base64 data URL
    const qrCodeDataUrl = await generateQRCodeImage(userId)

    // Load and populate template
    let htmlContent = emailTemplate
      .replace('{{ROLE}}', role)
      .replace('{{NAME}}', username)

    // Send email using Nodemailer
    await transporter.sendMail({
      from: `"Better Esperia Access" <${SMTP_USER}>`,
      to: dest,
      subject: 'Iscrizione alla Cogestione effettuata!',
      text: `Iscrizione completata! Il tuo ID utente è: ${userId}`,
      html: htmlContent,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeDataUrl.split(',')[1],
          encoding: 'base64',
          contentType: 'image/png',
          cid: 'qrcode'
        }
      ]
    })
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

export { sendMail }

const emailTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: 'Arial', sans-serif
        background: #111111
        margin: 0
        padding: 40px 20px
      }
      .ticket {
        background: #111111
        max-width: 600px
        margin: 0 auto
        border-radius: 15px
        box-shadow: 0 4px 8px rgba(0,0,0,0.1)
        overflow: hidden
      }
      .ticket-header {
        background: #ae201f
        color: white
        padding: 20px
        text-align: center
      }
      .ticket-body {
        padding: 30px
        color: #FFFFFF
      }
      .qr-section {
        margin: 20px 0
        padding: 20px
        background: #1e1e1e
        border-radius: 10px
      }
      .qr-code {
        width: 100%
        background: #e0e0e0
        margin-left: auto
        margin-right: auto
      }
      .details {
        flex: 1
        padding-left: 20px
      }
      .warning {
        background: #fff3cd
        border-left: 4px solid #ffc107
        padding: 15px
        margin: 20px 0
        color: #111111
      }
      .ticket-footer {
        background: #1e1e1e
        color: #FFFFFF
        padding: 15px
        text-align: center
        font-size: 0.9em
        border-top: 1px dashed #dee2e6
      }

      .detail-item {
        padding: 10px
        background: #1e1e1e
        border-radius: 5px
      }
    </style>
  </head>
  <body>
    <div class="ticket">
      <div class="ticket-header">
        <h1 style="margin: 0">Cogestione Invernale 2024</h1>
        <p style="margin: 10px 0 0 0">Whithout cogestione there is no esperia</p>
      </div>

      <div class="ticket-body">
        <h2>Ce l'hai fatta!</h2>

        <div class="event-details">
          <div class="detail-item">
            <strong>Data:</strong><br>
            21 Dicembre 2024
          </div>
          <div class="detail-item">
            <strong>Orario:</strong><br>
            08:00 - 12:00
          </div>
          <div class="detail-item">
            <strong>Partecipante:</strong><br>
            {{NAME}}
          </div>
          <div class="detail-item">
            <strong>Ruolo:</strong><br>
            {{ROLE}}
          </div>
        </div>

        <div class="qr-section">
          <div class="details">
            <h3>Il tuo QR Code personale</h3>
            <p>Il giorno della cogestione, presenta questo qrcode all'ingresso della scuola.</p>
          </div>
          <img src="cid:qrcode" alt="QR Code" class="qr-code" />
        </div>

        <div class="warning">
          <strong>⚠️ Importante:</strong>
          <p style="margin: 10px 0 0 0">Questo QR Code è strettamente personale e diventa invalido dopo la scansione. Per evitare problemi, non condividetelo con altri. Fate i bravi.</p>
        </div>
      </div>

      <div class="ticket-footer">
        <p style="margin: 0">Per assistenza: comitato.studentesco@itispaleocapa.it • Telegram: @branilaa</p>
      </div>
    </div>
  </body>
  </html>
`
