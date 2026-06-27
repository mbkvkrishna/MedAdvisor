class Auth {
  constructor() {
    this.email = localStorage.getItem('userEmail');
    this.name = localStorage.getItem('userName');
  }

  isAuthenticated() {
    return !!this.email;
  }

  setUser(email, name = '') {
    this.email = email;
    this.name = name;
    localStorage.setItem('userEmail', email);
    if (name) localStorage.setItem('userName', name);
  }

  clearUser() {
    this.email = null;
    this.name = null;
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  }

  async login(email, password) {
    const response = await fetch('/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    this.setUser(data.email, data.name);
    return data;
  }

  async signup(email, password, name = '') {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Sign up failed');
    this.setUser(data.email, data.name);
    return data;
  }

  async logout() {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
      });
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      this.clearUser();
      window.location.href = '/login';
    }
  }

  async deleteAccount() {
    const response = await fetch('/auth/delete-account', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete account');
    this.clearUser();
    return data;
  }
}

const auth = new Auth();

window.addEventListener('DOMContentLoaded', () => {
  const headerRight = document.getElementById('headerRight');
  if (!headerRight) return;

  const isDashboard = window.location.pathname.startsWith('/dashboard');

  if (auth.isAuthenticated()) {
    headerRight.innerHTML = `
      <div class="user-menu">
        <span class="user-email">${auth.name || auth.email}</span>
        ${!isDashboard ? `<a href="/dashboard" class="header-btn">Dashboard</a>` : ''}
        ${!isDashboard ? `<button id="logoutHeaderBtn" class="header-btn">Logout</button>` : ''}
      </div>
    `;
    const logoutHeaderBtn = document.getElementById('logoutHeaderBtn');
    if (logoutHeaderBtn) {
      logoutHeaderBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) auth.logout();
      });
    }
  } else {
    headerRight.innerHTML = `<a href="/login" class="header-btn">Login</a>`;
  }
});
