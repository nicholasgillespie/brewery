/* IMPORT INPUT VALIDATORS //////////////////// */
import validator from '../validators/validator.js';
/* IMPORT HELPER FUNCTIONS //////////////////// */
import { normalizeData } from '../utils/helpers.js';

export default {
  async contactForm(reqBody) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      firstname, surname, email, message,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateFirstname(firstname);
    validator.validateSurname(surname);
    validator.validateEmail(email);
    validator.validateMessage(message);

    // 4. Create document object
    const document = {
      firstname,
      surname,
      email,
      message,
    };

    // 5. Add additional fields
    // 6. Return document
    return document;
  },
};
