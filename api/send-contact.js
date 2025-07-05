const nodemailer = require('nodemailer');

// Configuração do Outlook/Hotmail
const OUTLOOK_USER = 'professor_luz@hotmail.com';
const OUTLOOK_PASS = 'Az26250430@';
const DEST_EMAIL = 'daniloluz@aim.com'; // Novo destinatário

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Dados inválidos.' });
  }

  // Configura o transporte SMTP do Outlook
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: OUTLOOK_USER,
      pass: OUTLOOK_PASS,
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  const mailOptions = {
    from: `${name} <${OUTLOOK_USER}>`,
    to: DEST_EMAIL,
    subject: 'Nova mensagem do site Lux Solutions',
    text: `Nome: ${name}\nEmail: ${email}\nMensagem:\n${message}`,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({ success: false, error: 'Falha ao enviar email.' });
  }
} 