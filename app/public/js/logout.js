import config from './config.js';
import alerts from './alert.js';

export default {
  module: () => {
    /* DATA - (dt) //////////////////// */
    const { SITE_URL, API_URL, PATH_USERS } = config;

    /* ELEMENTS - (els) //////////////////// */
    const logoutBtn = document.getElementById('logout');

    /* FUNCTIONS - (fx) //////////////////// */
    const logout = async () => {
      try {
        const res = await fetch(`${API_URL}${PATH_USERS}/logout`, {
          method: 'GET',
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        if (data.status === 'success') {
          alerts.showAlert('Logout successful.', data.status);
          window.setTimeout(() => window.location.replace(`${SITE_URL}`), 1500);
        }
      } catch (err) {
        alerts.showAlert('Error logging out. Please try again.', 'fail');
      }
    };
        
    /* EVENT LISTENERS - (eh) //////////////////// */
    // ACTION - LOAD BEERS IN SYNC WITH URL
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  },
};
