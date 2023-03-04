import config from './config.js';
import alerts from './alert.js';

export default {
  module: () => {
    /* DATA - (dt) //////////////////// */
    const { SITE_URL, API_URL, PATH_USERS } = config;

    /* ELEMENTS - (els) //////////////////// */
    const signupForm = document.querySelector('.page-signup form');

    /* FUNCTIONS - (fx) //////////////////// */
    const signup = async (firstname, surname, email, password, passwordConfirm) => {
      try {
        const res = await fetch(`${API_URL}${PATH_USERS}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstname, surname, email, password, passwordConfirm }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message}${data.status}`);
        if (data.status === 'success') {
          alerts.showAlert('Signup successful.', data.status);
          window.setTimeout(() => location.assign(`${SITE_URL}/account`), 1500);
        }
      } catch (err) {
        const message = err.message.slice(0, err.message.lastIndexOf('.') + 1);
        const status = err.message.slice(err.message.lastIndexOf('.') + 1).trim();
        const errorMessage = message.startsWith('E11000') ? 'This email has already been taken.' : message;
        const errorStatus = message.startsWith('E11000') ? 'fail' : status;
        alerts.showAlert(errorMessage, errorStatus);
      }
    };
        
    /* EVENT LISTENERS - (eh) //////////////////// */
    // ACTION - SUBMIT LOGIN FORM TO LOGIN USER
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstname = document.querySelector('#firstname').value;        
        const surname = document.querySelector('#surname').value;        
        const email = document.querySelector('#email').value.toLowerCase();
        const password = document.querySelector('#password').value;        
        const passwordConfirm = document.querySelector('#passwordConfirm').value;
        signup(firstname, surname, email, password, passwordConfirm);
      });
    }
  },
};
