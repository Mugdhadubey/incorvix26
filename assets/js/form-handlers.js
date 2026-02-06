// Form Handlers for HTML version
// Contact Form Handler
function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('submit-btn');
  const originalText = submitBtn.textContent;
  
  // Get form data
  const formData = {
    name: document.getElementById('contact-name').value,
    email: document.getElementById('contact-email').value,
    message: document.getElementById('contact-message').value
  };
  
  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  
  // Try to submit to API endpoint (PHP fallback if backend not available)
  const apiEndpoint = '/api/contact.php';
  
  // Try PHP first, fallback to Node.js API if exists
  fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(result => {
    if (result.success) {
      if (typeof showToast === 'function') {
        showToast('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success', 6000);
      } else {
        alert('Thank you for your message! We will get back to you soon.');
      }
      form.reset();
    } else {
      if (typeof showToast === 'function') {
        showToast('Failed to send message: ' + (result.error || 'Please try again.'), 'error');
      } else {
        alert('Failed to send message: ' + (result.error || 'Please try again.'));
      }
    }
  })
  .catch(error => {
    console.error('Error:', error);
    if (typeof showToast === 'function') {
      showToast('Network error: Please check your connection and try again.', 'error');
    } else {
      alert('Network error: Please check your connection and try again.');
    }
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}

// Career Form Handler
function handleCVChange(event) {
  const file = event.target.files[0];
  const fileNameEl = document.getElementById('cv-file-name');
  
  if (file && fileNameEl) {
    // Validate file type (only PDF and DOC)
    const fileExt = file.name.split('.').pop().toLowerCase();
    const allowedExts = ['pdf', 'doc'];
    
    if (!allowedExts.includes(fileExt)) {
      const errorMsg = 'Invalid file type. Only PDF and DOC files are allowed.';
      console.error('CV file validation error:', errorMsg);
      
      if (typeof showToast === 'function') {
        showToast(errorMsg, 'error', 5000);
      } else {
        alert(errorMsg);
      }
      
      // Clear the file input
      event.target.value = '';
      fileNameEl.textContent = 'Click to upload your CV';
      return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      const errorMsg = 'File size exceeds 10MB limit. Please upload a smaller file.';
      console.error('CV file size error:', errorMsg);
      
      if (typeof showToast === 'function') {
        showToast(errorMsg, 'error', 5000);
      } else {
        alert(errorMsg);
      }
      
      // Clear the file input
      event.target.value = '';
      fileNameEl.textContent = 'Click to upload your CV';
      return;
    }
    
    // File is valid
    fileNameEl.textContent = file.name;
    console.log('CV file selected:', file.name, '(' + (file.size / 1024).toFixed(2) + ' KB)');
  }
}

function handleCareerSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('career-submit-btn');
  const statusEl = document.getElementById('application-status');
  
  const originalText = submitBtn.innerHTML;
  
  // Disable button
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Submitting...</span>';
  
  // Get form data - use FormData to include the actual file
  const formData = new FormData(form);
  
  // Log form data for debugging
  console.log('=== Career Form Submission Debug ===');
  console.log('Submitting career form...');
  console.log('Form element:', form);
  
  // Get all form values directly from form elements (for verification)
  const nameInput = form.querySelector('[name="name"]');
  const emailInput = form.querySelector('[name="email"]');
  const positionInput = form.querySelector('[name="position"]');
  
  console.log('Direct form values:');
  console.log('  Name input value:', nameInput?.value || 'NOT FOUND');
  console.log('  Email input value:', emailInput?.value || 'NOT FOUND');
  console.log('  Position select value:', positionInput?.value || 'NOT FOUND');
  
  // Verify all required fields are present in FormData
  const formEntries = [];
  for (let pair of formData.entries()) {
    const value = pair[1] instanceof File ? `[File: ${pair[1].name}, ${pair[1].size} bytes]` : pair[1];
    console.log(`FormData field: ${pair[0]} = ${value}`);
    formEntries.push({name: pair[0], value: value});
  }
  
  // Check if required fields exist AND have values
  const requiredFields = ['name', 'email', 'position'];
  const missingFields = [];
  
  requiredFields.forEach(field => {
    const value = formData.get(field);
    if (!formData.has(field) || !value || (typeof value === 'string' && value.trim() === '')) {
      missingFields.push(field);
      console.error(`❌ ${field.toUpperCase()} is missing or empty!`);
      console.error(`   FormData.has('${field}'):`, formData.has(field));
      console.error(`   FormData.get('${field}'):`, value);
      
      // Check if form element exists
      const element = form.querySelector(`[name="${field}"]`);
      if (element) {
        console.error(`   Element exists, value:`, element.value);
      } else {
        console.error(`   ❌ Form element [name="${field}"] NOT FOUND in HTML!`);
      }
    }
  });
  
  if (missingFields.length > 0) {
    console.error('❌ Missing or empty required fields:', missingFields);
    const fieldNames = {
      'name': 'Full Name',
      'email': 'Email Address',
      'position': 'Position'
    };
    const errorMsg = 'Please fill in all required fields: ' + missingFields.map(f => fieldNames[f] || f).join(', ');
    if (typeof showToast === 'function') {
      showToast(errorMsg, 'error');
    } else {
      alert(errorMsg);
    }
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    return;
  }
  
  console.log('✅ All required fields validated before submission');
  
  // Get the endpoint URL - handle both relative and absolute paths
  const apiEndpoint = '/api/careers.php';
  console.log('API Endpoint:', apiEndpoint);
  console.log('Form entries count:', formEntries.length);
  
  // Submit to API endpoint with FormData (includes file)
  fetch(apiEndpoint, {
    method: 'POST',
    // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    body: formData,
    // Add cache control
    cache: 'no-cache',
    credentials: 'same-origin',
    // Add timeout handling
    signal: AbortSignal.timeout(30000) // 30 second timeout
  })
  .then(async response => {
    console.log('=== Response Received ===');
    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    console.log('Response ok:', response.ok);
    
    // Get response content type
    const contentType = response.headers.get('content-type');
    console.log('Response Content-Type:', contentType);
    
    // Try to get response text first to see what we're getting
    const responseText = await response.text();
    console.log('Response text length:', responseText.length);
    console.log('Response text (first 500 chars):', responseText.substring(0, 500));
    
    // Check if response looks like HTML (usually means PHP error or 404)
    if (responseText.trim().startsWith('<') || responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
      console.error('❌ Server returned HTML instead of JSON. This usually means:');
      console.error('1. PHP file not found (404)');
      console.error('2. PHP error occurred');
      console.error('3. Server configuration issue');
      console.error('Full HTML response:', responseText.substring(0, 1000));
      throw new Error('Server returned an HTML page instead of JSON. Please check: 1) api/careers.php exists on server, 2) PHP is enabled, 3) Check server error logs.');
    }
    
    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ Successfully parsed JSON response');
      console.log('Parsed result:', result);
    } catch (e) {
      console.error('❌ Failed to parse JSON response:', e);
      console.error('Response text (full):', responseText);
      throw new Error('Server returned invalid JSON. Check server logs for PHP errors. Response: ' + responseText.substring(0, 200));
    }
    
    if (!response.ok) {
      // If status is not OK, show detailed error
      console.error('❌ Request failed with status', response.status);
      console.error('Error from server:', result.error);
      
      if (response.status === 400) {
        console.error('⚠️ 400 BAD REQUEST - Server rejected the request');
        console.error('This usually means:');
        console.error('  - Required form fields are missing');
        console.error('  - Form data is not being received by PHP');
        console.error('  - Field names mismatch');
      }
      
      if (result.debug) {
        console.error('🔍 Debug info from server:', result.debug);
        console.error('This means the server received the request but found issues:');
        
        if (result.debug.name && result.debug.name.includes('missing')) {
          console.error('❌ NAME field is MISSING!');
          console.error('   - Check form field name="name" exists');
          console.error('   - Check FormData includes name field');
        }
        if (result.debug.email && result.debug.email.includes('missing')) {
          console.error('❌ EMAIL field is MISSING!');
          console.error('   - Check form field name="email" exists');
        }
        if (result.debug.position && result.debug.position.includes('missing')) {
          console.error('❌ POSITION field is MISSING!');
          console.error('   - Check form field name="position" exists');
        }
        
        if (result.debug.post_keys) {
          console.error('📋 POST keys received by server:', result.debug.post_keys);
          console.error('   Expected: name, email, position, phone, experience, message, cv');
          const missingKeys = ['name', 'email', 'position'].filter(key => !result.debug.post_keys.includes(key));
          if (missingKeys.length > 0) {
            console.error('❌ Missing keys:', missingKeys);
          }
        }
        
        if (result.debug.received_data) {
          console.error('📦 Data received by server:', result.debug.received_data);
        }
        
        if (result.debug.content_type) {
          console.error('📧 Content-Type:', result.debug.content_type);
          console.error('   Should be: multipart/form-data with boundary');
          if (!result.debug.content_type.includes('multipart/form-data')) {
            console.error('⚠️ Content-Type mismatch! FormData may not be working.');
          }
        }
        
        if (result.debug.files_keys) {
          console.error('📎 FILES keys:', result.debug.files_keys);
          if (!result.debug.files_keys.includes('cv')) {
            console.error('⚠️ CV file not received in $_FILES');
          }
        }
      }
      
      const errorMsg = result.error || result.message || 'Network response was not ok';
      let userMessage = errorMsg;
      
      if (response.status === 400 && result.debug) {
        if (result.debug.name && result.debug.name.includes('missing')) {
          userMessage = 'Please fill in your Full Name';
        } else if (result.debug.email && result.debug.email.includes('missing')) {
          userMessage = 'Please fill in your Email Address';
        } else if (result.debug.position && result.debug.position.includes('missing')) {
          userMessage = 'Please select a Position';
        } else {
          userMessage = 'Please fill in all required fields (Name, Email, Position)';
        }
      }
      
      const debugInfo = result.debug ? '\n\nDebug: ' + JSON.stringify(result.debug, null, 2) : '';
      throw new Error(userMessage + debugInfo);
    }
    
    console.log('✅ Request successful!');
    
    return result;
  })
  .then(result => {
    if (result.success) {
      // Log email status for debugging
      console.log('✅ Form submission successful!');
      console.log('📧 Email Status:', {
        sent: result.email_sent,
        to: result.email_to,
        method: result.email_method,
        attachment_status: result.attachment_status,
        attachment_warning: result.attachment_warning || 'none'
      });
      
      // Check if attachment warning exists
      if (result.attachment_warning) {
        console.warn('⚠️ CV attachment warning:', result.attachment_warning);
        console.warn('Email sent successfully, but CV attachment failed:', result.attachment_warning);
      }
      
      // Check if email was actually sent
      if (result.email_sent === false) {
        console.error('❌ WARNING: Server says success BUT email_sent is false!');
        console.error('This means email failed to send but form was processed.');
      }
      
      // Show success message
      if (statusEl) {
        statusEl.classList.remove('hidden');
        statusEl.className = 'mb-8 p-4 bg-green-50 border border-green-200 rounded-lg';
        statusEl.querySelector('p').textContent = result.message || 'Thank you for your application! We\'ll review your CV and get back to you soon.';
      }
      
      // Show toast if available
      if (typeof showToast === 'function') {
        const successMsg = result.attachment_warning 
          ? 'Application submitted! (Note: CV attachment issue - email sent without attachment)'
          : 'Thank you! Your application has been submitted successfully. We\'ll review your CV and get back to you soon.';
        showToast(successMsg, result.attachment_warning ? 'warning' : 'success', 6000);
      }
      
      // Reset form
      form.reset();
      const cvFileEl = document.getElementById('career-cv');
      if (cvFileEl) cvFileEl.value = '';
      if (document.getElementById('cv-file-name')) {
        document.getElementById('cv-file-name').textContent = 'Click to upload your CV';
      }
      
      // Scroll to status
      if (statusEl) {
        statusEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // Show error message
      if (typeof showToast === 'function') {
        showToast('Failed to submit application: ' + (result.error || 'Please try again later.'), 'error');
      } else {
        alert('Failed to submit application: ' + (result.error || 'Please try again later.'));
      }
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  })
  .catch(error => {
    console.error('=== Career Form Error ===');
    console.error('Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      type: error.type
    });
    
    // Determine specific error type
    let errorMessage = 'Network error: Please check your connection and try again.';
    
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      errorMessage = 'Request timed out. The server is taking too long to respond. Please try again.';
      console.error('❌ Request timeout after 30 seconds');
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      errorMessage = 'Network error: Cannot reach server at ' + apiEndpoint + '. Please verify:\n' +
                     '1. File exists: api/careers.php is uploaded to server\n' +
                     '2. PHP is enabled on server\n' +
                     '3. Check Network tab in browser DevTools (F12)\n' +
                     '4. Server is accessible';
      console.error('❌ Network request failed - Possible causes:');
      console.error('   - Endpoint not found (404):', apiEndpoint);
      console.error('   - Server is down');
      console.error('   - CORS issue');
      console.error('   - File not uploaded correctly');
    } else if (error.message.includes('HTTP error')) {
      errorMessage = 'Server error: ' + error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Additional diagnostic
    console.error('🔍 Diagnostic Information:');
    console.error('   Current URL:', window.location.href);
    console.error('   API Endpoint (relative):', apiEndpoint);
    console.error('   Full API URL would be:', window.location.origin + apiEndpoint);
    console.error('   Test endpoint availability:', 'Try visiting ' + window.location.origin + apiEndpoint + ' in browser');
    
    console.error('Final error message:', errorMessage);
    console.error('API Endpoint attempted:', apiEndpoint);
    console.error('Form data was:', formEntries);
    
    if (typeof showToast === 'function') {
      showToast(errorMessage, 'error', 8000);
    } else {
      alert(errorMessage);
    }
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  });
}

// Make functions globally available
window.handleContactSubmit = handleContactSubmit;
window.handleCVChange = handleCVChange;
window.handleCareerSubmit = handleCareerSubmit;

