const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight (OPTIONS) requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ success: false, error: 'Method not allowed' })
      };
    }

    // Parse JSON body
    const { name, email, message } = JSON.parse(event.body || '{}');

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Dados inválidos.' })
      };
    }

    // Environment variables (set in Netlify dashboard)
    const OUTLOOK_USER = process.env.OUTLOOK_USER;
    const OUTLOOK_PASS = process.env.OUTLOOK_PASS;
    const DEST_EMAIL = process.env.DEST_EMAIL;

    if (!OUTLOOK_USER || !OUTLOOK_PASS || !DEST_EMAIL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: 'Server configuration error.' })
      };
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
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('--- UNCAUGHT ERROR ---', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'An internal server error occurred.' })
    };
  }
};
