/*
 * Accessible contact form
 * - Native validation still works if this script fails to load.
 * - With JS, errors appear next to each field (linked with aria-describedby),
 *   and a summary at the top receives focus so screen readers announce it.
 * - Success and failure messages are announced through a role="status" region.
 */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) { return; }

  var summary = document.getElementById('error-summary');
  var summaryList = document.getElementById('error-summary-list');
  var status = document.getElementById('form-status');
  var button = document.getElementById('submit-button');
  var fields = Array.prototype.slice.call(form.querySelectorAll('[data-field]'));

  // Turn off the browser's own bubbles so our messages are the only ones.
  form.noValidate = true;

  var messages = {
    name: { valueMissing: 'Enter your name.' },
    email: {
      valueMissing: 'Enter your email address.',
      typeMismatch: 'Enter an email address in the format name@example.com.'
    },
    topic: { valueMissing: 'Choose a topic.' },
    message: {
      valueMissing: 'Enter a message.',
      tooShort: 'Write at least 10 characters so I have enough to reply to.'
    }
  };

  function getError(field) {
    var value = field.value.trim();
    var set = messages[field.name] || {};

    if (field.required && value === '') { return set.valueMissing; }
    if (field.validity.typeMismatch) { return set.typeMismatch; }
    if (field.minLength > 0 && value.length < field.minLength) { return set.tooShort; }
    return '';
  }

  function showError(field, text) {
    var target = document.getElementById(field.id + '-error');
    field.setAttribute('aria-invalid', 'true');
    target.textContent = text;
    target.hidden = false;
  }

  function clearError(field) {
    var target = document.getElementById(field.id + '-error');
    field.removeAttribute('aria-invalid');
    target.textContent = '';
    target.hidden = true;
  }

  function hideSummary() {
    summary.hidden = true;
    summaryList.innerHTML = '';
  }

  function renderSummary(errors) {
    summaryList.innerHTML = '';

    errors.forEach(function (item) {
      var li = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + item.field.id;
      link.textContent = item.text;
      link.addEventListener('click', function (event) {
        event.preventDefault();
        item.field.focus();
      });
      li.appendChild(link);
      summaryList.appendChild(li);
    });

    summary.hidden = false;
    summary.focus();
  }

  function setStatus(kind, text) {
    status.className = 'status status-' + kind;
    status.textContent = text;
  }

  function clearStatus() {
    status.className = 'status';
    status.textContent = '';
  }

  // Re-check a field as the person fixes it, but only after it was flagged.
  fields.forEach(function (field) {
    var recheck = function () {
      if (field.getAttribute('aria-invalid') === 'true') {
        var text = getError(field);
        if (text) { showError(field, text); } else { clearError(field); }
      }
    };
    field.addEventListener('input', recheck);
    field.addEventListener('change', recheck);
  });

  function send() {
    var endpoint = form.getAttribute('data-endpoint');

    // No endpoint set: show the success state so the design can be reviewed.
    if (!endpoint) {
      form.reset();
      setStatus('success', 'Thank you. Your message is ready to send, but this demo form is not connected to an email service yet.');
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending\u2026';

    fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (!response.ok) { throw new Error('Request failed'); }
        form.reset();
        setStatus('success', 'Thank you. Your message has been sent. I will reply as soon as I can.');
      })
      .catch(function () {
        setStatus('failure', 'Your message could not be sent. Try again, or email suasia2121@gmail.com.');
      })
      .then(function () {
        button.disabled = false;
        button.textContent = 'Send message';
      });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearStatus();

    var errors = [];
    fields.forEach(function (field) {
      var text = getError(field);
      if (text) {
        showError(field, text);
        errors.push({ field: field, text: text });
      } else {
        clearError(field);
      }
    });

    if (errors.length) {
      renderSummary(errors);
      return;
    }

    hideSummary();
    send();
  });
})();
