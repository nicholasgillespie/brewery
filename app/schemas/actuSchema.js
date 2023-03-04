/* IMPORT INPUT VALIDATORS //////////////////// */
import validator from '../validators/validator.js';
/* IMPORT HELPER FUNCTIONS //////////////////// */
import { normalizeData, slugify } from '../utils/helpers.js';

export default {
  async create(reqBody) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      type, title, description, date, time, address, postalCode, city, country,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateType(type);
    validator.validateTitle(title);
    validator.validateDescription(description);
    validator.validateDate(date);
    if (time) validator.validateTime(time);
    if (address) validator.validateAddress(address);
    if (postalCode) validator.validatePostalCode(postalCode);
    if (type === 'event') validator.validateCity(city);
    if (type === 'event' && country) validator.validateCountry(country);

    // 4. Create document object
    const document = {
      type,
      title,
      description,
      date,
    };
    if (time) document.time = time;
    if (address) document.address = address;
    if (postalCode) document.postalCode = postalCode;
    if (type === 'event') document.city = city;
    if (type === 'event' && country) document.country = country;

    // 5. Add additional fields
    document.slug = slugify(document.title);
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
      type, title, description, date, time, address, postalCode, city, country, active,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateType(type);
    validator.validateTitle(title);
    validator.validateDescription(description);
    validator.validateDate(date);
    if (time) validator.validateTime(time);
    if (address) validator.validateAddress(address);
    if (postalCode) validator.validatePostalCode(postalCode);
    if (type === 'event') validator.validateCity(city);
    if (type === 'event' && country) validator.validateCountry(country);
    validator.validateBoolean(reqBodyNormalized.active);

    // 4. Create document object
    const document = {
      type,
      title,
      description,
      date,
      active,
    };
    if (time) document.time = time;
    if (address) document.address = address;
    if (postalCode) document.postalCode = postalCode;
    if (type === 'event') document.city = city;
    if (type === 'event' && country) document.country = country;

    // 5. Add additional fields
    document.slug = slugify(document.title);

    // 6. Return document
    return document;
  },
};
