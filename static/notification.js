class Toast {
  constructor() {
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = `
        position:fixed;top:20px;right:20px;z-index:2000;
        display:flex;flex-direction:column;gap:10px;
      `;
      document.body.appendChild(container);
    }

    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0);     opacity: 1; }
          to   { transform: translateX(400px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  show(message, type = 'info', duration = 4000) {
    const colors = {
      success: '#1a472a',
      error:   '#3a1a1a',
      warning: '#3a3a1a'
    };

    const el = document.createElement('div');
    el.style.cssText = `
      padding:12px 16px;border-radius:6px;color:#fff;font-size:14px;
      max-width:300px;box-shadow:0 2px 8px rgba(0,0,0,0.2);
      animation:slideIn 0.3s ease-out;
      background:${colors[type] || '#0a2a4a'};
    `;
    el.textContent = message;
    document.getElementById('notification-container').appendChild(el);

    if (duration > 0) {
      setTimeout(() => {
        el.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => el.remove(), 300);
      }, duration);
    }

    return el;
  }

  success(message, duration = 3000) { return this.show(message, 'success', duration); }
  error(message, duration = 5000)   { return this.show(message, 'error',   duration); }
  warning(message, duration = 4000) { return this.show(message, 'warning', duration); }
}

const notification = new Toast();
