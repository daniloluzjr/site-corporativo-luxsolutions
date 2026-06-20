const https = require('https');

module.exports = async (req, res) => {
  try {
    console.log('--- New Request Received ---');

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Dados inválidos.' });
    }

    // Forward the request to the Railway API which already handles SMTP email sending via Brevo.
    // This centralizes credentials on the Railway server and bypasses Vercel environment setup issues.
    const data = JSON.stringify({
      user_name: name,
      user_email: email,
      message: message
    });

    const options = {
      hostname: 'luxhealthsystem.up.railway.app',
      port: 443,
      path: '/api/contact_form.php',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const request = https.request(options, (response) => {
      let body = '';
      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.success) {
            console.log('Email forwarded and sent successfully via Railway backend!');
            return res.status(200).json({ success: true });
          } else {
            console.error('Railway backend returned failure:', parsed);
            return res.status(500).json({ success: false, error: parsed.message || 'Failed to send message.' });
          }
        } catch (e) {
          console.error('Failed to parse Railway response:', body, e);
          return res.status(500).json({ success: false, error: 'Malformed response from backend.' });
        }
      });
    });

    request.on('error', (error) => {
      console.error('Proxy request connection error:', error);
      return res.status(500).json({ success: false, error: 'Internal connection error.' });
    });

    request.write(data);
    request.end();

  } catch (error) {
    console.error('--- UNCAUGHT ERROR ---', error);
    return res.status(500).json({ success: false, error: error.message || 'An internal server error occurred.' });
  }
};