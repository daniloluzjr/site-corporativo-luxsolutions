const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  try {
    console.log('--- New Request Received ---');

    const OUTLOOK_USER = process.env.OUTLOOK_USER;
    const OUTLOOK_PASS = process.env.OUTLOOK_PASS;
    const DEST_EMAIL = process.env.DEST_EMAIL;

    console.log('OUTLOOK_USER is set:', !!OUTLOOK_USER);
    console.log('OUTLOOK_PASS is set:', !!OUTLOOK_PASS ? 'Yes' : 'No');

    if (!OUTLOOK_USER || !OUTLOOK_PASS || !DEST_EMAIL) {
      console.error('Error: Missing one or more environment variables.');
      return res.status(500).json({ success: false, error: 'Server configuration error.' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Dados inválidos.' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: OUTLOOK_USER,
        pass: OUTLOOK_PASS,
      },
    });

    const mailOptions = {
      from: `${name} <${OUTLOOK_USER}>`,
      to: DEST_EMAIL,
      subject: 'Nova mensagem do site Lux Solutions',
      text: `Nome: ${name}\nEmail: ${email}\nMensagem:\n${message}`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('--- UNCAUGHT ERROR ---', error);
    return res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
}; 