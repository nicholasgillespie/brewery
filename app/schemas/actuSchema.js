/* IMPORT INPUT VALIDATORS //////////////////// */
import validator from '../validators/validator.js';
/* IMPORT HELPER FUNCTIONS //////////////////// */
import { normalizeData, slugify } from '../utils/helpers.js';
/* IMAGE PROCESSING //////////////////// */
import processFile from '../utils/processFile.js';

export default {
  async create(reqBody, reqFile) {
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
    if (type === 'event' || city) validator.validateCity(city);
    if (type === 'event' || country) validator.validateCountry(country);
    validator.validateFileImage(reqFile, ['image']);

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
    if (city) document.city = city;
    if (country) document.country = country;

    // 5. Resize image & save to disk & update document
    await processFile.resizeSavePhoto('actus', 'image')(document.title, reqFile);
    document.image = reqFile.filename;

    // 6. Add additional fields
    document.slug = slugify(document.title);
    document.createdAt = new Date();
    document.active = true;

    // 7. Return document
    return document;
  },

  async update(reqBody, reqFile) {
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
    if (type === 'event' || city) validator.validateCity(city);
    if (type === 'event' || country) validator.validateCountry(country);
    if (reqFile) validator.validateFileImage(reqFile, ['image']);
    validator.validateBoolean(active);

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
    if (city) document.city = city;
    if (country) document.country = country;

    // 5. Resize image & save to disk & update document
    if (reqFile) await processFile.resizeSavePhoto('actus', 'image')(document.title, reqFile);
    if (reqFile) document.image = reqFile.filename;

    // 6. Add additional fields
    document.slug = slugify(document.title);

    // 7. Return document
    return document;
  },
};
