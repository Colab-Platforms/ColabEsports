// ===========================================
// SIMPLE AUTHENTICATION SYSTEM
// ===========================================

// API Configuration - PUT YOUR API URL HERE
const API_URL = 'https://your-api-url.com'; // CHANGE THIS TO YOUR API URL

// Global variables
let isLoggedIn = false;

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 10001;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white; padding: 15px 20px; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===========================================
// FORM FUNCTIONS
// ===========================================

// Show/Hide Forms
function showSideLoginForm() {
  document.getElementById('loginFormSide').style.display = 'block';
  document.getElementById('signupFormSide').style.display = 'none';
  document.getElementById('forgotPasswordFormSide').style.display = 'none';
}

function showSideSignupForm() {
  document.getElementById('loginFormSide').style.display = 'none';
  document.getElementById('signupFormSide').style.display = 'block';
  document.getElementById('forgotPasswordFormSide').style.display = 'none';
}

function showForgotPasswordForm() {
  document.getElementById('loginFormSide').style.display = 'none';
  document.getElementById('signupFormSide').style.display = 'none';
  document.getElementById('forgotPasswordFormSide').style.display = 'block';
}

// ===========================================
// SIDEMENU FUNCTIONS
// ===========================================

function openSidemenu() {
  document.getElementById('sidemenuWrapper').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSidemenu() {
  document.getElementById('sidemenuWrapper').classList.remove('show');
  document.body.style.overflow = 'auto';
}

// ===========================================
// API FUNCTIONS
// ===========================================

// LOGIN API
async function handleSidemenuLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('sideLoginEmail').value.trim();
  const password = document.getElementById('sideLoginPassword').value;
  const submitBtn = event.target.querySelector('button[type="submit"]');
  
  if (!email || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Show loading
  submitBtn.textContent = 'Logging in...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update UI
      showLoggedInState(data.user);
      showNotification('Login successful!', 'success');
      
      // Clear form
      document.getElementById('sideLoginEmail').value = '';
      document.getElementById('sideLoginPassword').value = '';
      
    } else {
      showNotification(data.message || 'Login failed', 'error');
    }
    
  } catch (error) {
    showNotification('Network error. Please try again.', 'error');
  } finally {
    submitBtn.textContent = 'Login';
    submitBtn.disabled = false;
  }
}

// SIGNUP API
async function handleSidemenuSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('sideSignupName').value.trim();
  const email = document.getElementById('sideSignupEmail').value.trim();
  const password = document.getElementById('sideSignupPassword').value;
  const confirmPassword = document.getElementById('sideConfirmPassword').value;
  const submitBtn = event.target.querySelector('button[type="submit"]');
  
  if (!name || !email || !password || !confirmPassword) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }
  
  // Show loading
  submitBtn.textContent = 'Creating Account...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showNotification('Account created successfully!', 'success');
      showSideLoginForm();
      
      // Clear form
      document.getElementById('sideSignupName').value = '';
      document.getElementById('sideSignupEmail').value = '';
      document.getElementById('sideSignupPassword').value = '';
      document.getElementById('sideConfirmPassword').value = '';
      
    } else {
      showNotification(data.message || 'Signup failed', 'error');
    }
    
  } catch (error) {
    showNotification('Network error. Please try again.', 'error');
  } finally {
    submitBtn.textContent = 'Sign Up';
    submitBtn.disabled = false;
  }
}

// FORGOT PASSWORD API
async function handleForgotPassword(event) {
  event.preventDefault();
  
  const email = document.getElementById('sideForgotEmail').value.trim();
  const submitBtn = event.target.querySelector('button[type="submit"]');
  
  if (!email) {
    showNotification('Please enter your email', 'error');
    return;
  }
  
  // Show loading
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showNotification('Reset link sent to your email!', 'success');
      document.getElementById('sideForgotEmail').value = '';
      setTimeout(() => showSideLoginForm(), 2000);
    } else {
      showNotification(data.message || 'Failed to send reset email', 'error');
    }
    
  } catch (error) {
    showNotification('Network error. Please try again.', 'error');
  } finally {
    submitBtn.textContent = 'Send Reset Link';
    submitBtn.disabled = false;
  }
}

// ===========================================
// UI UPDATE FUNCTIONS
// ===========================================

function showLoggedInState(user) {
  // Hide auth forms
  document.getElementById('loginFormSide').style.display = 'none';
  document.getElementById('signupFormSide').style.display = 'none';
  document.getElementById('forgotPasswordFormSide').style.display = 'none';
  
  // Show logged in state
  document.getElementById('loggedInState').style.display = 'block';
  document.getElementById('profileMenuOptions').style.display = 'block';
  
  // Update user info
  document.getElementById('sideUserName').textContent = `Welcome ${user.name}`;
  document.getElementById('sideUserEmail').textContent = user.email;
  
  isLoggedIn = true;
}

function handleLogout() {
  // Clear data
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Reset UI
  document.getElementById('loggedInState').style.display = 'none';
  document.getElementById('profileMenuOptions').style.display = 'none';
  
  showSideLoginForm();
  closeSidemenu();
  showNotification('Logged out successfully!', 'success');
  
  isLoggedIn = false;
}

// ===========================================
// MENU HANDLERS
// ===========================================

function handleViewProfile() {
  window.location.href = 'profile.html';
}

function handleWallet() {
  window.location.href = 'payment.html';
}

function handleSettings() {
  window.location.href = 'update.html';
}

// ===========================================
// CS2 MODAL FUNCTIONS
// ===========================================

function openCS2SetupModal() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    // Use custom notification instead of alert
    showNotification('Please login or create an account to join matches!', 'info');
    setTimeout(() => {
      openSidemenu();
      showSideLoginForm();
    }, 500);
    return;
  }
  
  document.getElementById('cs2SetupModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCS2SetupModal() {
  document.getElementById('cs2SetupModal').classList.remove('show');
  document.body.style.overflow = 'auto';
}

function redirectToGamePage() {
  closeCS2SetupModal();
  setTimeout(() => {
    window.open('https://store.steampowered.com/app/730/CounterStrike_2/', '_blank');
  }, 300);
}

// ===========================================
// MODAL FUNCTIONS
// ===========================================

function showWelcomeModal() {
  const modal = document.getElementById('welcomeModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeWelcomeModal() {
  const modal = document.getElementById('welcomeModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}

// ===========================================
// GLOBAL WINDOW FUNCTIONS
// ===========================================

window.openSidemenu = openSidemenu;
window.closeSidemenu = closeSidemenu;
window.showSideLoginForm = showSideLoginForm;
window.showSideSignupForm = showSideSignupForm;
window.showForgotPasswordForm = showForgotPasswordForm;
window.handleSidemenuLogin = handleSidemenuLogin;
window.handleSidemenuSignup = handleSidemenuSignup;
window.handleForgotPassword = handleForgotPassword;
window.handleLogout = handleLogout;
window.handleViewProfile = handleViewProfile;
window.handleWallet = handleWallet;
window.handleSettings = handleSettings;
window.openCS2SetupModal = openCS2SetupModal;
window.closeCS2SetupModal = closeCS2SetupModal;
window.redirectToGamePage = redirectToGamePage;
window.showWelcomeModal = showWelcomeModal;
window.closeWelcomeModal = closeWelcomeModal;

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      showLoggedInState(userData);
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }
  
  // Set up sidemenu toggle
  const sideMenuToggler = document.querySelector('.sideMenuToggler');
  if (sideMenuToggler) {
    sideMenuToggler.addEventListener('click', openSidemenu);
  }
  
  // Close sidemenu when clicking outside
  const sidemenuWrapper = document.getElementById('sidemenuWrapper');
  if (sidemenuWrapper) {
    sidemenuWrapper.addEventListener('click', function(e) {
      if (e.target === this) closeSidemenu();
    });
  }
  
  // Show welcome modal after 3 seconds if not logged in
  setTimeout(() => {
    if (!isLoggedIn) showWelcomeModal();
  }, 3000);
  
  // Set current year
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeWelcomeModal();
    closeSidemenu();
  }
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
