/**
 * Form Validation & Submission Handler
 * 
 * Provides real-time validation, loading states, and AJAX form submission
 * with success/error feedback for contact forms.
 * 
 * Usage:
 * - Add id="contactForm" to your form element
 * - Add class="form-control" to inputs and textareas
 * - Include .invalid-feedback div for each field
 * - Include .form-status div for submission feedback
 */

(function() {
  'use strict';

  // Configuration
  const FORM_CONFIG = {
    formSelector: '#contactForm',
    submitButtonSelector: '.btn[type="submit"]',
    statusSelector: '.form-status',
    feedbackHideDelay: 5000 // ms
  };

  /**
   * Initialize form validation on page load
   */
  function initializeFormValidation() {
    const form = document.querySelector(FORM_CONFIG.formSelector);
    
    if (!form) {
      console.warn('Form not found:', FORM_CONFIG.formSelector);
      return;
    }

    // Listen for form submission
    form.addEventListener('submit', handleFormSubmit);

    // Optional: Real-time validation on input
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('change', validateField);
    });
  }

  /**
   * Validate a single field
   * @param {Event} event - The event object
   */
  function validateField(event) {
    const field = event.target;
    const isValid = field.checkValidity();

    if (isValid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
    }
  }

  /**
   * Handle form submission
   * @param {Event} event - The form submission event
   */
  function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector(FORM_CONFIG.submitButtonSelector);
    const statusDiv = form.querySelector(FORM_CONFIG.statusSelector);

    // Validate all fields
    if (!form.checkValidity()) {
      // HTML5 validation failed, show feedback
      Array.from(form.elements).forEach(field => {
        if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
          if (!field.checkValidity()) {
            field.classList.add('is-invalid');
          }
        }
      });
      return;
    }

    // Add loading state to button
    addLoadingState(submitBtn);

    // Prepare form data
    const formData = new FormData(form);

    // Submit via AJAX
    fetch(form.action || window.location.href, {
      method: form.method || 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest' // Identify as AJAX request
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        removeLoadingState(submitBtn);

        if (data.success) {
          // Show success message
          showSuccessMessage(statusDiv, data.message || 'Form submitted successfully!');
          
          // Reset form
          form.reset();
          
          // Clear validation states
          form.querySelectorAll('.form-control').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
          });
        } else {
          // Show error message
          showErrorMessage(statusDiv, data.message || 'Something went wrong. Please try again.');
        }
      })
      .catch(error => {
        removeLoadingState(submitBtn);
        console.error('Form submission error:', error);
        showErrorMessage(statusDiv, 'Network error. Please check your connection and try again.');
      });
  }

  /**
   * Add loading state to submit button
   * @param {HTMLElement} button - The submit button element
   */
  function addLoadingState(button) {
    button.disabled = true;
    button.classList.add('is-loading');
    
    // Store original text
    button.dataset.originalText = button.textContent;
    
    // Add loading spinner
    button.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Submitting...
    `;
  }

  /**
   * Remove loading state from submit button
   * @param {HTMLElement} button - The submit button element
   */
  function removeLoadingState(button) {
    button.disabled = false;
    button.classList.remove('is-loading');
    button.textContent = button.dataset.originalText || 'Submit';
  }

  /**
   * Show success message
   * @param {HTMLElement} statusDiv - The status feedback container
   * @param {string} message - The success message
   */
  function showSuccessMessage(statusDiv, message) {
    if (!statusDiv) return;

    statusDiv.className = 'form-status alert alert-success alert-dismissible fade show';
    statusDiv.setAttribute('role', 'alert');
    statusDiv.innerHTML = `
      <i class="fas fa-check-circle me-2" aria-hidden="true"></i>
      <strong>Success!</strong> ${escapeHtml(message)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Auto-hide after delay
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, FORM_CONFIG.feedbackHideDelay);
  }

  /**
   * Show error message
   * @param {HTMLElement} statusDiv - The status feedback container
   * @param {string} message - The error message
   */
  function showErrorMessage(statusDiv, message) {
    if (!statusDiv) return;

    statusDiv.className = 'form-status alert alert-danger alert-dismissible fade show';
    statusDiv.setAttribute('role', 'alert');
    statusDiv.innerHTML = `
      <i class="fas fa-exclamation-circle me-2" aria-hidden="true"></i>
      <strong>Error!</strong> ${escapeHtml(message)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Auto-hide after delay
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, FORM_CONFIG.feedbackHideDelay);
  }

  /**
   * Escape HTML special characters to prevent XSS
   * @param {string} text - The text to escape
   * @returns {string} - The escaped text
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFormValidation);
  } else {
    initializeFormValidation();
  }
})();
