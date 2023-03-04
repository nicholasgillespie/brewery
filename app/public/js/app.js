import home from './home.js';
import sitefeatures from './sitefeatures.js';
import signup from './signup.js';
import login from './login.js';
import logout from './logout.js';
import account from './account.js';
import passwordForgot from './password-forgot.js';
import passwordReset from './password-reset.js';

const app = {
  init() {
    // SITE FEATURES
    sitefeatures.hamburger();
    sitefeatures.skipLink();

    // HOME PAGE
    home.module();

    // SIGNUP PAGE
    signup.module();

    // LOGIN PAGE
    login.module();

    // LOGOUT BUTTON
    logout.module();
  
    // ACCOUNT PAGE
    account.module();

    // FORGOT PASSWORD PAGE
    passwordForgot.module();

    // RESET PASSWORD PAGE
    passwordReset.module();
  },
};

document.addEventListener('DOMContentLoaded', app.init);
