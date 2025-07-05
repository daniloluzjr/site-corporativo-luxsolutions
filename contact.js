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

  // Prepare data as JSON
  const data = { name, email, message };

  // Send data to Vercel serverless API endpoint
  fetch('/.netlify/functions/send-contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
          hideStatus();
        }, 3000);
      } else {
        showStatus(data.error || 'Failed to send message. Please try again.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    })
    .catch(error => {
      showStatus('Failed to send message. Please try again.', 'error');
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