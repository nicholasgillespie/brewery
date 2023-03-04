/* IMPORT INPUT VALIDATORS //////////////////// */
import validator from '../validators/validator.js';
/* IMPORT HELPER FUNCTIONS //////////////////// */
import { normalizeData, separateValues, slugify } from '../utils/helpers.js';

export default {
  async create(reqBody) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      name, description, style, abv, ibu, ebv, malts, hops, spices,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateName(name);
    validator.validateDescription(description);
    validator.validateStyle(style);
    validator.validateNumericalValue(abv, 'abv');
    validator.validateNumericalValue(ibu, 'ibu');
    validator.validateNumericalValue(ebv, 'ebv');

    // Convert to string if present
    const maltsString = Array.isArray(malts) ? malts.join(',') : malts;
    const hopsString = Array.isArray(hops) ? hops.join(',') : hops;
    let spicesString;
    if (spices) spicesString = Array.isArray(spices) ? spices.join(',') : spices;

    // Validate ingredients (continued)
    validator.validateIngredient(maltsString, 'malts');
    validator.validateIngredient(hopsString, 'hops');
    if (spicesString) validator.validateIngredient(spicesString, 'spices');

    // 4. Create document object
    const document = {
      name,
      description,
      style,
      abv: parseFloat(parseFloat(abv).toFixed(2)),
      ibu: parseFloat(parseFloat(ibu).toFixed(2)),
      ebv: parseFloat(parseFloat(ebv).toFixed(2)),
      malts: separateValues(maltsString),
      hops: separateValues(hopsString),
    };
    if (spicesString && spicesString.length > 0) document.spices = separateValues(spicesString);

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
      name, description, style, abv, ibu, ebv, malts, hops, spices, active,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateName(name);
    validator.validateDescription(description);
    validator.validateStyle(style);
    validator.validateNumericalValue(abv, 'abv');
    validator.validateNumericalValue(ibu, 'ibu');
    validator.validateNumericalValue(ebv, 'ebv');

    // Convert to string if present
    const maltsString = Array.isArray(malts) ? malts.join(',') : malts;
    const hopsString = Array.isArray(hops) ? hops.join(',') : hops;
    let spicesString;
    if (spices) spicesString = Array.isArray(spices) ? spices.join(',') : spices;

    // Validate ingredients (continued)
    validator.validateIngredient(maltsString, 'malts');
    validator.validateIngredient(hopsString, 'hops');
    if (spicesString) validator.validateIngredient(spicesString, 'spices');
    validator.validateBoolean(reqBodyNormalized.active);

    // 4. Create document object
    const document = {
      name,
      description,
      style,
      abv: parseFloat(parseFloat(abv).toFixed(2)),
      ibu: parseFloat(parseFloat(ibu).toFixed(2)),
      ebv: parseFloat(parseFloat(ebv).toFixed(2)),
      malts: separateValues(maltsString),
      hops: separateValues(hopsString),
      active,
    };
    if (spicesString && spicesString.length > 0) document.spices = separateValues(spicesString);

    // 5. Add additional fields
    document.slug = slugify(document.name);

    // 6. Return document
    return document;
  },
};
