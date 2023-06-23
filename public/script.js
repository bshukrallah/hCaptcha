
// submit button code
document.getElementById('contactForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  //get the data from the captcha, if it hasn't been done yet, it will be blank
  var hcaptchaResponse = grecaptcha.getResponse();
  
  // if captcha isn't complete do this
  if (hcaptchaResponse === '') {
    console.log('Please complete the hCaptcha challenge.');
    return;
  }

  // prevent double listening
  if (!this.classList.contains('listener-registered')) {
    this.classList.add('listener-registered');

    // if captcha is complete do this ...
    try {
      //url served from app.js
      const verificationUrl = 'verify-captcha';

      // send over the completed hCaptcha data for verification, and wait for a response back 
      const response = await fetch(verificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hcaptchaResponse }), // Send hcaptchaResponse in the request body
      });

      // this is the data returned from the above function
      const data = await response.json();

      // if success is passed back from app.js do this
      if (data.success) {
        console.log('hCaptcha verification successful!');
        // Proceed with form submission or other actions
        // Code goes here that handles submission
      } else {
        console.error('hCaptcha verification failed:', data['error-codes']);
        // Handle verification failure
        // Code goes here that handles if the captcha fails
      }
    } catch (error) {
      // Error if something went wrong with hcaptcha
      console.error('Error verifying hCaptcha:', error);
    }
  }
});
