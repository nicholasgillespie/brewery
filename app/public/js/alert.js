const alerts = {
  hideAlert: () => {
    const el = document.querySelector('.b-alert');
    if (el) {
      el.parentElement.removeChild(el);
      window.setTimeout(alerts.hideAlert, 3000);
    }
  },

  showAlert: (message, status) => {
    alerts.hideAlert();
    const markup = `<div class="b-alert" data-alert="${status}">${message}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  },

  formatAlertMessage: (errMessage) => {
    let errors = errMessage.split('}')[0];
    errors = errors.slice(1, -1);
    errors = errors.split('",');
  
    let formattedMessage = '';
    errors.forEach(error => {
      let errorArray = error.split(':');
      let message = errorArray[1].replace(/\"/g, '');
      formattedMessage += `${message}<br>`;
    });
    return formattedMessage;
  },
};

export default alerts;
