import config from './config.js';
import alerts from './alert.js';
import htmlBlock from './htmlBlock.js';

export default {
  module: () => {
    /* DATA - (dt) //////////////////// */
    const { SITE_URL, API_URL, PATH_BEERS, PATH_LOCATIONS, PATH_ACTUS, PATH_ARTISTES, PATH_USERS } = config;
    let htmlAdded = false;

    /* ELEMENTS - (els) //////////////////// */
    const container = document.querySelector('.page-account #container');

    const accountBtn = document.querySelector('.page-account #account-btn');
    const beersBtn = document.querySelector('.page-account #beers-btn');
    const locationsBtn = document.querySelector('.page-account #locations-btn');
    const actusEventsBtn = document.querySelector('.page-account #actus-btn');
    const artistesBtn = document.querySelector('.page-account #artistes-btn');
    const usersBtn = document.querySelector('.page-account #users-btn');

    /* FUNCTIONS - (fx) //////////////////// */
    const getAccountData = async () => {
      try {
        const res = await fetch(`${API_URL}${PATH_USERS}/account`);
        const data = await res.json();
        displayAccount(data.data.result);
      } catch (err) {
        alerts.showAlert('Error fetching account data. Try again later.', 'fail');
        setTimeout(() => { alerts.hideAlert(); } , 1500);
      };
    };

    const displayAccount = (data) => {
      try {
        container.innerHTML = '';
        const html = `
          <div id="container-account" class="stack">
            <h2>account settings</h2>
            <form id="account-form" class="stack">
              <div class="switcher">
                <div>
                  <label class="u-vh" for="firstname">firstname (required)</label>
                  <input placeholder="firstname" type="text" id="firstname" name="firstname" value="${data.firstname}" autocomplete="firstname" required>
                </div>
                <div>
                  <label class="u-vh" for="surname">surname (required)</label>
                  <input placeholder="surname" type="text" id="surname" name="surname" value="${data.surname}" autocomplete="surname" required>
                </div>
              </div>       
              <label class="u-vh" for="email">email (required)</label>
              <input placeholder="email" type="email" id="email" name="email" value="${data.email}" autocomplete="email" required>
              <button>save settings</button>
            </form>

            <h2>password change</h2>
            <form id="password-form" class="stack">
              <label class="u-vh" for="passwordCurrent">passwordCurrent (required)</label>
              <input placeholder="Current password" type="password" id="passwordCurrent" name="passwordCurrent" autocomplete="passwordCurrent" required>
              <label class="u-vh" for="password">password (required)</label>
              <input placeholder="New password" type="password" id="password" name="password" autocomplete="password" required>
              <label class="u-vh" for="passwordConfirm">passwordConfirm (required)</label>
              <input placeholder="Confirm new password" type="password" id="passwordConfirm" name="passwordConfirm" autocomplete="passwordConfirm" required>
              <button>save password</button>
            </form>
            </div>`;
            // <h2>delete account</h2>
        container.insertAdjacentHTML('beforeend', html);
      } catch (err) {
        alerts.showAlert('Error loading content. Try again later.', 'fail');
        setTimeout(() => { alerts.hideAlert(); } , 1500);
      };  
    };

    const updateAccount = async (body, type) => {
      try {
        const url = type === 'password' 
          ? `${API_URL}${PATH_USERS}/update-password/` 
          : `${API_URL}${PATH_USERS}/update-account/`;

        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} ${data.status}`);
        if (data.status === 'success' || data.status === 'warning') alerts.showAlert(data.message, data.status);
        setTimeout(() => { 
          alerts.hideAlert();
          getAccountData();
        } , 1500);
      } catch (err) {
        handleErrorMessage(err);
      }
    };

    const showData = (btn, path, type, value, ref) => {
      if (btn) {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          htmlAdded = false;
          getAll(path, type, value, ref);
        });
      }
    };

    const collectFormData = (form) => {
      const inputs = form.querySelectorAll('input, textarea, select');
      const data = {};
      inputs.forEach(input => {
        if (input.getAttribute('id') !== 'active') {
          if (input.type === 'checkbox') {
            data[input.getAttribute('id')] = input.checked;
          } else {
            data[input.getAttribute('id')] = input.value;
          }
        }
      });
      return data;
    };

    const displayFormFields = (data, fields) => {
      let html = "";
      let abvIbuEbvHtml = "";

      fields.forEach((field, index) => {
        if (field === "abv" || field === "ibu" || field === "ebv") {
          abvIbuEbvHtml += `
            <div class="flow">
              <label for="${field}">${field}:</label>
              <input type="text" id="${field}" placeholder="${field}" value="${data[field] || ''}">
            </div>`;
          if (index === fields.length - 1 || fields[index + 1] !== "abv" && fields[index + 1] !== "ibu" && fields[index + 1] !== "ebv") {
            html += `<div class="switcher">${abvIbuEbvHtml}</div>`;
            abvIbuEbvHtml = "";
          }
        } else {
          if (field === "description") {
            html += `
            <div class="flow">
              <label for="${field}">${field}:</label>
              <textarea id="${field}" rows="4" cols="50">${data[field] || ''}</textarea>
            </div>`;
          } else if (field === "available") {
            html += `
            <fieldset>
              <legend>beer available on:</legend>
              <div>
                <input type="checkbox" id="tap" name="${field}" ${data[field].tap ? "checked" : ""}>
                <label for="tap">tap</label>
              </div>
              <div>
                <input type="checkbox" id="bottle" name="${field}" ${data[field].bottle ? "checked" : ""}>
                <label for="bottle">bottle</label>
              </div>
            </fieldset>`;
          } else if (field === "date") {
            html += `
            <div class="flow">
              <label for="${field}">${field}:</label>
              <input type="date" id="${field}" value="${data[field] || ''}">
            </div>`;
          } else if (field === "time") {
            html += `
              <div class="flow">
                <label for="${field}">${field}:</label>
                <input type="time" id="${field}" value="${data[field] || ''}">
              </div>`;
          } else if (field === "type") {
            html += `
              <div class="flow">
                <label for="${field}">${field}:</label>
                <select id="${field}">
                  ${data[field] === "actu" ? `<option value="actu" selected>actu</option>` : `<option value="actu">actu</option>`}
                  ${data[field] === "event" ? `<option value="event" selected>event</option>` : `<option value="event">event</option>`}
                </select>
              </div>`;
          } else {
            html += `
            <div class="flow">
              <label for="${field}">${field}:</label>
              <input type="text" id="${field}" value="${data[field] || ''}">
            </div>`;
          }
        }
      });
    
      return html;
    };    

    const handleErrorMessage = (err) => {
      const message = err.message.slice(0, err.message.lastIndexOf('.') + 1);
      const status = err.message.slice(err.message.lastIndexOf('.') + 1).trim();
      alerts.showAlert(`${message}`, `${status}`);
      setTimeout(() => { alerts.hideAlert(); }, 1500);
    };    

    const getAll = async (path, type, value, ref) => {
      try {
        const res = await fetch(`${API_URL}${path}`);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} ${data.status}`);
        if (data.status === 'success') displayGetAll(type, value, ref, data.data.result);
      } catch (err) {
        handleErrorMessage(err);
      };
    };

    const displayGetAll = (type, value, ref, data) => {
      try {
        container.innerHTML = '';
        let html = `
        <div id="container-admin" class="stack">
          <div class="cluster" data-cluster="space-between">
            <h2>${type === 'user' ? "view" : "manage"} ${type}s</h2>
            ${type !== 'user' ? `<button data-type="${type}" data-value="${value}" data-ref="${ref}">add new ${type}</button>` : ''}
          </div>
          <table>
            <tr>
              <th>${value}</th>
              <th>${type === 'user' ? "view" : "edit"}</th>
            </tr>`;
          data.forEach(item => {
            html += `
            <tr>
              <td>${item[value]}</td>
              <td><button id="${item[ref]}" data-type="${type}" data-value="${value}" data-ref="${ref}">${type === 'user' ? "view" : "edit"}</button></td>
            </tr>`;
          });
        html += `</table>`;
        container.insertAdjacentHTML('beforeend', html);
      } catch (err) {
        handleErrorMessage(err);
      };
    };

    const getOne = async (path, type, value, ref) => {
      try {
        const res = await fetch(`${API_URL}${path}`);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} ${data.status}`);
        if (data.status === 'success') displayGetOne(`${API_URL}${path}`, type, value, ref, data.data.result);
      } catch (err) {
        handleErrorMessage(err);
      };
    };

    const displayGetOne = (path, type, value, ref, data) => {
      try {
        container.querySelector('table').remove();
        container.querySelector("h2").innerHTML = `${type}: ${data[value]}`;
        const button = type !== 'user' 
          ? container.querySelector("button") 
          : document.createElement('button');
        button.classList.add('cancel-update');
        button.innerHTML = "cancel";
        if (type === 'user') container.querySelector('#container-admin').querySelector('.cluster').appendChild(button);
        let html = `
          <form class="[ stack ][ u-padding ][ b-admin-item ]">`;

        // display form fields for each type of data
        if (type === "beer") {
          let fields = ["name", "description", "style", "abv", "ibu", "ebv", "malts", "hops", "spices", "active"];
          html += displayFormFields(data, fields);
        }
        if (type === "location") {
          let fields = ["name", "available", "address", "postalCode", "city", "country", "website", "active"];
          html += displayFormFields(data, fields);
        }
        if (type === "actu") {
          let fields = ["type", "title", "description", "date", "time", "address", "postalCode", "city", "country", "active"];
          html += displayFormFields(data, fields);
        }
        if (type === "artiste") {
          let fields = ["firstname", "surname", "description", "email", "pseudonym", "website", "facebook", "instagram", "twitter", "youtube", "active"];
          html += displayFormFields(data, fields);
        }
        if (type === "user") {
          let fields = ["firstname", "surname", "email", "role"];
          html += displayFormFields(data, fields);
        }
        
        // display cancel, update, retire and delete buttons
        if (type!== "user") {
          html += `
            <div class="u-padding">
              <div class="cluster" data-cluster="space-between">
                <div class="cluster" >
                  <button class="cancel-update">cancel</button>
                  <button data-path="${path.slice(path.lastIndexOf("/") + 1)}" data-type="${type}" data-value="${value}" data-ref="${ref}">${data.active === false ? "activate" : "update"}</button>
                </div>
                <button data-path="${path.slice(path.lastIndexOf("/") + 1)}" data-type="${type}" data-value="${value}" data-ref="${ref}">${data.active === false ? "delete" : "deactivate"}</button>
              </div>
            </div>`;
          }
          html += `</form>`;
        document.getElementById('container-admin').insertAdjacentHTML('beforeend', html);
        const cancelUpdateButtons = document.querySelectorAll(".cancel-update");
        cancelUpdateButtons.forEach(button => {
          button.addEventListener("click", () => {
            htmlAdded = false;
            getAll(`/${type}s`, type, value, ref);
          });
        });
      } catch (err) {
        alerts.showAlert('Error loading content. Try again later.', 'fail');
        setTimeout(() => { alerts.hideAlert(); } , 1500);
      };
    };
    
    const createOne = async (path, type, value, ref, body) => {
      try {
        const res = await fetch(`${API_URL}/${path}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} ${data.status}`);
        if (data.status === 'success') alerts.showAlert(data.message, data.status);
        setTimeout(() => {
          alerts.hideAlert();
          getAll(`/${type}s`, type, value, ref);
        } , 1500);
      } catch (err) {
        handleErrorMessage(err);
      };
    };

    const displayCreateOne = (type, value, ref) => {
      try {
        container.querySelector('table').remove();
        container.querySelector("h2").innerHTML = `create new ${type}`;
        const button = container.querySelector("button");
        button.classList.add('cancel-update');
        button.innerHTML = "cancel";

        let html;
        if (type === "beer") {
          html = htmlBlock.beer;
        } else if (type === "location") {
          html = htmlBlock.location;
        } else if (type === "actu") {
          html = htmlBlock.actu;
        } else if (type === "artiste") {
          html = htmlBlock.artiste;
        } else if (type === "user") {
          html = htmlBlock.user;
        }

        html += `
            <div class="[ cluster ][ u-padding ]" data-cluster='align-items'>
              <button class="cancel-update">cancel</button>
              <button data-type="${type}" data-value="${value}" data-ref="${ref}">create</button>
            </div>
          </form>`;
        document.getElementById('container-admin').insertAdjacentHTML('beforeend', html);
        const cancelUpdateButtons = document.querySelectorAll(".cancel-update");
        cancelUpdateButtons.forEach(button => {
          button.addEventListener("click", () => {
            getAll(`/${type}s`, type, value, ref);
          });
        });
      } catch (err) {
        alerts.showAlert('Error loading content. Try again later.', 'fail');
        setTimeout(() => { alerts.hideAlert(); } , 1500);
      };  
    };

    const updateOne = async (path, type, value, ref, body, id) => {
      try {
        const res = await fetch(`${API_URL}/${path}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok || data.status === 'warning') throw new Error(`${data.message} ${data.status}`);
        if (data.status === 'success') alerts.showAlert(data.message, data.status);
        setTimeout(() => { 
          alerts.hideAlert();
          getAll(`/${type}s`, type, value, ref);
        } , 1500);
      } catch (err) {
        handleErrorMessage(err);
      }
    };

    const deleteOne = async (path, type, value, ref, id) => {
      try {
        const res = await fetch(`${API_URL}/${path}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(`${data.message} ${data.status}`);
        }
        if (res.status === 204) alerts.showAlert(`${type[0].toUpperCase() + type.slice(1)} deleted successfully!`, 'success');
        setTimeout(() => { 
          alerts.hideAlert();
          getAll(`/${type}s`, type, value, ref);
        } , 1500);
      } catch (err) {
        handleErrorMessage(err);
      }
    };
    
    /* EVENT LISTENERS - (eh) //////////////////// */
    if (container) (() => getAccountData())();

    if (accountBtn) {
      accountBtn.addEventListener('click', () => {
        htmlAdded = false;
        getAccountData();
      });
    }

    showData(beersBtn, PATH_BEERS, 'beer', 'name', 'slug');
    showData(locationsBtn, PATH_LOCATIONS, "location", "name", "slug");
    showData(actusEventsBtn, PATH_ACTUS, "actu", "title", "slug");
    showData(artistesBtn, PATH_ARTISTES, "artiste", "slug", "slug");
    showData(usersBtn, PATH_USERS, "user", "email", "email");
    
    if (container) {
      container.addEventListener('submit', (e) => {
        if (e.target.tagName === 'FORM' && e.target.closest('#container-account')) {
          e.preventDefault();
          const formId = e.target.id;
          const data = collectFormData(e.target);
          if (formId === 'account-form') {
            updateAccount(data, 'account');
          } else if (formId === 'password-form') {
            updateAccount(data, 'password');
          }
        }        
      });

      let deactivateListener = null;
      container.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' && e.target.closest('#container-admin')) {
          e.preventDefault();

          // get item type (beer), value (name) & reference (slug)
          const itemPath = e.target.getAttribute('data-path');
          const itemType = e.target.getAttribute('data-type');
          const itemValue = e.target.getAttribute('data-value');
          const itemRef = e.target.getAttribute('data-ref');
          const btnText = e.target.textContent;

          if (btnText.startsWith('add new')) {
            displayCreateOne(itemType, itemValue, itemRef);

          } else if (btnText === 'create') {
            const data = collectFormData(e.target.closest('form'));
            createOne(`${itemType}s`, itemType, itemValue, itemRef, data);
            
          } else if (btnText === 'edit' || btnText === 'view') {
            getOne(`/${itemType}s/${e.target.id}`, itemType, itemValue, itemRef);

          } else if (btnText === 'update' || btnText === 'activate') {
            const data = collectFormData(e.target.closest('form'));
            data.active = true;
            updateOne(`${itemType}s`, itemType, itemValue, itemRef, data, itemPath);
            
          } else if (btnText === 'deactivate' || btnText === 'delete') {
            if (!htmlAdded) {
              const html = `
                <div id="confirm-delete" class="[ flow ][ u-padding ]">
                  <p>Are you sure you want to ${btnText === 'deactivate' ? "deactivate" : "permanently delete"} this ${itemType}?</p>
                  <div class="cluster">
                    <button class="cancel-update">cancel</button>
                    <button data-path="${itemPath}" data-type="${itemType}" data-value="${itemValue}" data-ref="${itemRef}">confirm</button>
                  </div>
                </div>`;
              e.target.closest('form').insertAdjacentHTML('afterend', html);
              htmlAdded = true;
            }

            if (deactivateListener !== null) {
              container.removeEventListener("click", deactivateListener);
            }

            deactivateListener = (e) => {
              if (e.target.tagName === "BUTTON") {
                if (e.target.closest("#confirm-delete")) {
                  if (e.target.innerText === "confirm") {
                    const data = collectFormData(document.querySelector('#container-admin form'));
                    data.active = false;
                    htmlAdded = false;
                    btnText === 'deactivate' 
                      ? updateOne(`${itemType}s`, itemType, itemValue, itemRef, data, itemPath) 
                      : deleteOne(`${itemType}s`, itemType, itemValue, itemRef, itemPath);

                  } else if (e.target.innerText === "cancel") {
                    htmlAdded = false;
                    e.target.closest('#confirm-delete').remove();
                  }
                }
              }
            };
            container.addEventListener("click", deactivateListener);
          }
        }
      });
    }
  },
};
