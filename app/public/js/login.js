import config from './config.js';
import alerts from './alert.js';

export default {
  module: () => {
    /* DATA - (dt) //////////////////// */
    const { SITE_URL, API_URL, PATH_USERS } = config;

    /* ELEMENTS - (els) //////////////////// */
    const loginForm = document.querySelector('.page-login form');

    /* FUNCTIONS - (fx) //////////////////// */
    const login = async (email, password) => {
      try {
        const res = await fetch(`${API_URL}${PATH_USERS}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message}${data.status}`);
        if (data.status === 'success') {
          alerts.showAlert('Login successful.', data.status);
          window.setTimeout(() => location.assign(`${SITE_URL}/account`), 1500);
        }
      } catch (err) {
        const message = err.message.slice(0, err.message.lastIndexOf('.') + 1);
        const status = err.message.slice(err.message.lastIndexOf('.') + 1).trim();
        alerts.showAlert(`${message}`, `${status}`);
      }
    };
        
    /* EVENT LISTENERS - (eh) //////////////////// */
    // ACTION - SUBMIT LOGIN FORM TO LOGIN USER
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value.toLowerCase();
        const password = document.querySelector('#password').value;        
        login(email, password);
      });
    }
  },
};
