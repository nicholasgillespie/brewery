/* IMPORT MODULES ////////////////////////// */
import bcrypt from 'bcryptjs';
/* IMPORT INPUT VALIDATORS //////////////////// */
import validator from '../validators/validator.js';
/* IMPORT HELPER FUNCTIONS //////////////////// */
import { normalizeData } from '../utils/helpers.js';
/* IMPORT MODULES ////////////////////////// */

export default {
  async create(reqBody) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      firstname, surname, email,
    } = reqBodyNormalized;

    let { password, passwordConfirm } = {
      password: reqBody.password.trim(),
      passwordConfirm: reqBody.passwordConfirm.trim(),
    };

    // 3. Validate input and return errors if any
    validator.validateFirstname(firstname);
    validator.validateSurname(surname);
    validator.validateEmail(email);
    validator.validatePassword(password);
    validator.validatePasswordConfirm(password, passwordConfirm);

    // Hash password
    password = await bcrypt.hash(password, 12);
    // Delete passwordConfirm from reqBody
    passwordConfirm = undefined;

    // 4. Create document object
    const document = {
      firstname,
      surname,
      email,
      password,
    };

    // 5. Add additional fields
    document.createdAt = new Date();
    document.role = 'user';
    document.active = true;

    // 6. Return document
    return document;
  },

  async update(reqBody) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      firstname, surname, email,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateFirstname(firstname);
    validator.validateSurname(surname);
    validator.validateEmail(email);

    // 4. Create document object
    const document = {
      firstname,
      surname,
      email,
    };

    // 5. Add additional fields

    // 6. Return document
    return document;
  },
};
