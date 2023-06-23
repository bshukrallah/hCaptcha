const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './environment.env' })

const port = process.env.PORT;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));


// Function to verify hcaptcha
app.post('/verify-captcha', async (req, res) => {
  const verificationUrl = 'https://hcaptcha.com/siteverify'; //hcaptcha URL
  const hcaptchaResponse = req.body.hcaptchaResponse; // Response sent from script.js
  try {
    const secretKey = process.env.HCAPTCHA_SECRET // Secret key gathered from test.env

    // This is the POST data sent to hcaptcha
    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${hcaptchaResponse}`,
    });

    // Waiting for hcaptcha response, store the response in a variable named data
    const data = await response.json();

    // if data contains success, send back to script.js success: true, or if it fails, send back success: false
    if (data.success) {
      // Proceed with form submission or other actions
      res.json({ success: true });
    } else {
      console.error('hCaptcha verification failed:', data['error-codes']);
      // Handle verification failure
      res.json({ success: false, error: 'Captcha verification failed' });
    }
  } catch (error) {
    // Error handling for hcaptcha, if something goes wrong it will log to the server console
    console.error('Error verifying hCaptcha:', error);
    res.json({ success: false, error: 'Error verifying hCaptcha' });
  }
});

// Server set up, listed on port specified in environment.env
app.listen(port, () => {
  console.log('Server listening on port ' + port);
});