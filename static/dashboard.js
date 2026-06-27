const backBtn = document.getElementById('backBtn');
const logoutBtn = document.getElementById('logoutBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const savedResults = document.getElementById('savedResults');
const emptyState = document.getElementById('emptyState');

window.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) {
    window.location.href = '/login';
    return;
  }
  loadSavedResults();
});

backBtn.addEventListener('click', () => {
  window.location.href = '/';
});

logoutBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to logout?')) auth.logout();
});

deleteAccountBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
    deleteAccount();
  }
});

async function loadSavedResults() {
  try {
    const response = await fetch('/results/get', {
      credentials: 'same-origin'
    });

    if (response.status === 401) {
      auth.clearUser();
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load results');

    const results = data.results || [];

    if (results.length === 0) {
      emptyState.style.display = 'block';
      savedResults.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    savedResults.style.display = 'grid';
    savedResults.innerHTML = '';

    results.forEach(result => {
      const card = document.createElement('div');
      card.className = 'result-card';

      const h3 = document.createElement('h3');
      h3.textContent = result.disease_name;

      const p = document.createElement('p');
      p.textContent = result.medicine_output;

      const actions = document.createElement('div');
      actions.className = 'result-card-actions';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'result-delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        if (confirm('Delete this saved result?')) deleteResult(result.id);
      });

      actions.appendChild(deleteBtn);
      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(actions);
      savedResults.appendChild(card);
    });
  } catch (error) {
    notification.error('Error loading saved results: ' + error.message);
  }
}

async function deleteResult(resultId) {
  try {
    const response = await fetch(`/results/delete/${resultId}`, {
      method: 'DELETE',
      credentials: 'same-origin'
    });

    if (response.status === 401) {
      auth.clearUser();
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete result');
    loadSavedResults();
  } catch (error) {
    notification.error('Error deleting result: ' + error.message);
  }
}

async function deleteAccount() {
  try {
    await auth.deleteAccount();
    notification.success('Account deleted successfully');
    setTimeout(() => { window.location.href = '/login'; }, 1500);
  } catch (error) {
    notification.error('Error deleting account: ' + error.message);
  }
}
