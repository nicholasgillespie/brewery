import config from './config.js';
import alerts from './alert.js';

export default {
  module: () => {
    /* DATA - (dt) //////////////////// */
    const { API_URL, PATH_USERS } = config;

    /* ELEMENTS - (els) //////////////////// */
    const forgotPasswordForm = document.querySelector('.page-forgot-password form');

    /* FUNCTIONS - (fx) //////////////////// */
    const requestPasswordResetToken = async (email) => {
      try {
        const res = await fetch(`${API_URL}${PATH_USERS}/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message}${data.status}`);
        if (data.status === 'success') {
          alerts.showAlert(data.message, data.status);
        }
      } catch (err) {
        const message = err.message.slice(0, err.message.lastIndexOf('.') + 1);
        const status = err.message.slice(err.message.lastIndexOf('.') + 1).trim();
        alerts.showAlert(`${message}`, `${status}`);
      }
    };
        
    /* EVENT LISTENERS - (eh) //////////////////// */
    // ACTION - SUBMIT LOGIN FORM TO LOGIN USER
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value.toLowerCase();   
        requestPasswordResetToken(email);
      });
    }
  },
};
