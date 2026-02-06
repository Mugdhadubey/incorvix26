// Simple Toast Notification System
function showToast(message, type = 'success', duration = 5000) {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast-notification');
  existingToasts.forEach(toast => toast.remove());
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  
  // Set icon and color based on type
  let icon = '';
  let bgColor = '';
  if (type === 'success') {
    icon = '✓';
    bgColor = '#10b981'; // green
  } else if (type === 'error') {
    icon = '✕';
    bgColor = '#ef4444'; // red
  } else {
    icon = 'ℹ';
    bgColor = '#3b82f6'; // blue
  }
  
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: ${bgColor}; color: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); min-width: 300px; max-width: 500px; font-size: 14px; font-weight: 500;">
      <span style="font-size: 18px; font-weight: bold;">${icon}</span>
      <span style="flex: 1;">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0; margin-left: 8px; opacity: 0.8; hover: opacity: 1;">×</button>
    </div>
  `;
  
  // Add styles
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation
  const style = document.createElement('style');
  if (!document.getElementById('toast-animations')) {
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to body
  document.body.appendChild(toast);
  
  // Auto remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }, duration);
  
  return toast;
}

// Make it globally available
window.showToast = showToast;

