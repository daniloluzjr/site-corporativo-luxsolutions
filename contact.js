// EmailJS Configuration
const EMAILJS_USER_ID = 'bxzD1INYBWHAGX2NV';
const EMAILJS_SERVICE_ID = 'service_smdnzwm';
const EMAILJS_TEMPLATE_ID = 'template_zoekcxq';

// Initialize EmailJS
emailjs.init(EMAILJS_USER_ID);

// DOM Elements
const contactForm = document.getElementById('contactForm');
const submitButton = document.getElementById('submitButton');
const formStatus = document.getElementById('formStatus');
const backButton = document.getElementById('backButton');

// Back button functionality
backButton.addEventListener('click', function() {
  window.location.href = 'index.html';
});

// Form submission
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form data
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  
  // Validate form
  if (!name || !email || !message) {
    showStatus('Please fill in all fields.', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showStatus('Please enter a valid email address.', 'error');
    return;
  }
  
  // Disable submit button and show loading
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  showStatus('Sending your message...', 'loading');
  
  // Prepare EmailJS parameters
  const templateParams = {
    from_name: name,
    from_email: email,
    message: message,
    to_email: 'daniloluz@aim.com'
  };
  
  // Send email via EmailJS
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      showStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
      contactForm.reset();
      
      // Re-enable submit button after delay
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        hideStatus();
      }, 3000);
    })
    .catch(function(error) {
      console.log('FAILED...', error);
      showStatus('Failed to send message. Please try again.', 'error');
      
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    });
});

// Helper function to show status messages
function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = 'block';
}

// Helper function to hide status messages
function hideStatus() {
  formStatus.style.display = 'none';
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Focus on first input when page loads
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('name').focus();
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    window.location.href = 'index.html';
  }
}); 