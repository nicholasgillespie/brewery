/* IMPORT INPUT VALIDATORS //////////////////// */
import validator from '../validators/validator.js';
/* IMPORT ERROR HANDLER //////////////////// */
import AppError from '../errors/appError.js';
/* IMPORT HELPER FUNCTIONS //////////////////// */
import { normalizeData, slugify } from '../utils/helpers.js';

export default {
  async create(reqBody) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      name, tap, bottle, address, postalCode, city, country, website,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateName(name);
    validator.validateBoolean(tap);
    validator.validateBoolean(bottle);
    if (tap === false && bottle === false) throw new AppError('Beer must be available in at least one type.', 400);
    validator.validateAddress(address);
    if (postalCode) validator.validatePostalCode(postalCode);
    validator.validateCity(city);
    validator.validateCountry(country);
    if (website) validator.validateWebsite(website);

    // 4. Create document object
    const document = {
      name,
      available: {
        tap, bottle,
      },
      address,
      city,
      country,
    };
    if (postalCode && postalCode.length > 0) document.postalCode = postalCode;
    if (website && website.length > 0) document.website = website;

    // 5. Add additional fields
    document.slug = slugify(document.name);
    document.createdAt = new Date();
    document.active = true;

    // 6. Return document
    return document;
  },

  async update(reqBody) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      name, tap, bottle, address, postalCode, city, country, website, active,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateName(name);
    validator.validateBoolean(tap);
    validator.validateBoolean(bottle);
    if (tap === false && bottle === false) throw new AppError('Beer must be available in at least one type.', 400);
    validator.validateAddress(address);
    if (postalCode) validator.validatePostalCode(postalCode);
    validator.validateCity(city);
    validator.validateCountry(country);
    if (website) validator.validateWebsite(website);
    validator.validateBoolean(reqBodyNormalized.active);

    // 4. Create document object
    const document = {
      name,
      available: {
        tap, bottle,
      },
      address,
      city,
      country,
      active,
    };
    if (postalCode && postalCode.length > 0) document.postalCode = postalCode;
    if (website && website.length > 0) document.website = website;

    // 5. Add additional fields
    document.slug = slugify(document.name);

    // 6. Return document
    return document;
  },
};
