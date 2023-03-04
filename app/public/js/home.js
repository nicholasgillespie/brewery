import config from './config.js';
import alerts from './alert.js';

export default {
  module: () => {
    /* DATA - (dt) //////////////////// */
    const { SITE_URL, EMAIL_EB } = config;

    /* ELEMENTS - (els) //////////////////// */
    const contactForm = document.querySelector('.page-home form');

    /* FUNCTIONS - (fx) //////////////////// */
    const contact = async (firstname, surname, email, message) => {
      try {
        const res = await fetch(`${SITE_URL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstname, surname, email, message }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message}${data.status}`);
        if (data.status === 'success') {
          alerts.showAlert(data.message, data.status);

          // Clear form fields
          document.querySelector('#firstname').value = '';
          document.querySelector('#surname').value = '';
          document.querySelector('#email').value = '';
          document.querySelector('#message').value = '';
        }
      } catch (err) {
        const message = err.message.slice(0, err.message.lastIndexOf('.') + 1);
        const status = err.message.slice(err.message.lastIndexOf('.') + 1).trim();
        alerts.showAlert(`${message}`, `${status}`);
      }
    };
        
    /* EVENT LISTENERS - (eh) //////////////////// */
    // ACTION - SUBMIT CONTACT FORM
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstname = document.querySelector('#firstname').value;
        const surname = document.querySelector('#surname').value;
        const email = document.querySelector('#email').value;
        const message = document.querySelector('#message').value;

        contact(firstname, surname, email, message);
      });
    }
  },
};
