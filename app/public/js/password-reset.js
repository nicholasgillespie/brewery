import config from './config.js';
import alerts from './alert.js';

export default {
  module: () => {
    /* DATA - (dt) //////////////////// */
    const { SITE_URL, API_URL, PATH_USERS } = config;

    /* ELEMENTS - (els) //////////////////// */
    const passwordResetForm = document.querySelector('.page-reset-password form');

    /* FUNCTIONS - (fx) //////////////////// */
    const resetPassword = async (password, passwordConfirm) => {
      try {
        const token = window.location.href.split('/').pop();
        const res = await fetch(`${API_URL}${PATH_USERS}/reset-password/${token}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, passwordConfirm }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message}${data.status}`);
        if (data.status === 'success') {
          alerts.showAlert('Password reset successful.', data.status);
          window.setTimeout(() => location.assign(`${SITE_URL}/login`), 1500);
        }
      } catch (err) {
        const message = err.message.slice(0, err.message.lastIndexOf('.') + 1);
        const status = err.message.slice(err.message.lastIndexOf('.') + 1).trim();
        alerts.showAlert(`${message}`, `${status}`);
      }
    };
        
    /* EVENT LISTENERS - (eh) //////////////////// */
    // ACTION - SUBMIT LOGIN FORM TO LOGIN USER
    if (passwordResetForm) {
      passwordResetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.querySelector('#password').value;        
        const passwordConfirm = document.querySelector('#passwordConfirm').value;     
        resetPassword(password, passwordConfirm);
      });
    }
  },
};
