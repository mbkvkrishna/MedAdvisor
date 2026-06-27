const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('message');
const toggleMode = document.getElementById('toggleMode');
const toggleText = document.getElementById('toggleText');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const nameRow = document.getElementById('nameRow');

let isSignup = false;

window.addEventListener('DOMContentLoaded', () => {
  if (auth.isAuthenticated()) {
    window.location.href = '/';
  }
});

toggleMode.addEventListener('click', () => {
  isSignup = !isSignup;
  message.classList.add('hidden');

  if (isSignup) {
    authTitle.textContent = 'Sign Up';
    authSubtitle.textContent = 'Create your free account';
    nameRow.style.display = 'block';
    nameInput.focus();
    submitBtn.textContent = 'Create Account';
    toggleText.textContent = 'Already have an account?';
    toggleMode.textContent = 'Login';
    passwordInput.setAttribute('autocomplete', 'new-password');
  } else {
    authTitle.textContent = 'Login';
    authSubtitle.textContent = 'Welcome back — sign in to your account';
    nameRow.style.display = 'none';
    emailInput.focus();
    submitBtn.textContent = 'Login';
    toggleText.textContent = "Don't have an account?";
    toggleMode.textContent = 'Sign up';
    passwordInput.setAttribute('autocomplete', 'current-password');
  }
});

submitBtn.addEventListener('click', async () => {
  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value;
  const nameValue = nameInput.value.trim();

  if (!emailValue || !isValidEmail(emailValue)) {
    showMessage('Please enter a valid email address', 'error');
    return;
  }
  if (!passwordValue) {
    showMessage('Please enter your password', 'error');
    return;
  }
  if (isSignup && !nameValue) {
    showMessage('Please enter your name', 'error');
    return;
  }
  if (isSignup && passwordValue.length < 6) {
    showMessage('Password must be at least 6 characters', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = isSignup ? 'Creating account…' : 'Signing in…';

  try {
    if (isSignup) {
      await auth.signup(emailValue, passwordValue, nameValue);
    } else {
      await auth.login(emailValue, passwordValue);
    }
    window.location.href = '/';
  } catch (error) {
    showMessage(error.message, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = isSignup ? 'Create Account' : 'Login';
  }
});

[nameInput, emailInput, passwordInput].forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitBtn.click();
  });
});

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = 'auth-message ' + type;
  message.classList.remove('hidden');
}
