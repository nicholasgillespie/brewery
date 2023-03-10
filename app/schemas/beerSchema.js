/* IMPORT INPUT VALIDATORS //////////////////// */
import validator from '../validators/validator.js';
/* IMPORT HELPER FUNCTIONS //////////////////// */
import { normalizeData, separateValues, slugify } from '../utils/helpers.js';
/* IMAGE PROCESSING //////////////////// */
import processFile from '../utils/processFile.js';

export default {
  async create(reqBody, reqFiles) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      name, description, keywords, style, abv, ibu, ebv, malts, hops, spices,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateName(name);
    validator.validateDescription(description);
    const keywordsString = Array.isArray(keywords) ? keywords.join(',') : keywords;
    validator.validateIngredient(keywordsString, 'keywords');
    validator.validateStyle(style);
    validator.validateNumericalValue(abv, 'abv');
    validator.validateNumericalValue(ibu, 'ibu');
    validator.validateNumericalValue(ebv, 'ebv');
    validator.validateFileImages(reqFiles, ['image', 'cover', 'aroma-web']);
        
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
      keywords: separateValues(keywordsString),
      style,
      abv: parseFloat(parseFloat(abv).toFixed(2)),
      ibu: parseFloat(parseFloat(ibu).toFixed(2)),
      ebv: parseFloat(parseFloat(ebv).toFixed(2)),
      malts: separateValues(maltsString),
      hops: separateValues(hopsString),
    };
    if (spicesString && spicesString.length > 0) document.spices = separateValues(spicesString);

    // 5. Resize image & save to disk & update document
    const image = await processFile.resizeSavePhotos('beers', ['image', 'cover', 'aroma-web'])(document.name, reqFiles);
    document.image = image['image'];
    document.cover = image['cover'];
    document['aroma-web'] = image['aroma-web'];

    // 6. Add additional fields
    document.slug = slugify(document.name);
    document.createdAt = new Date();
    document.active = true;

    // 7. Return document
    return document;
  },

  async update(reqBody, reqFiles) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      name, description, keywords, style, abv, ibu, ebv, malts, hops, spices, active,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateName(name);
    validator.validateDescription(description);
    validator.validateStyle(style);
    validator.validateNumericalValue(abv, 'abv');
    validator.validateNumericalValue(ibu, 'ibu');
    validator.validateNumericalValue(ebv, 'ebv');
    if (reqFiles) validator.validateFileImages(reqFiles, ['image', 'cover', 'aroma-web'], false);

    // Convert to string if present
    const keywordsString = Array.isArray(keywords) ? keywords.join(',') : keywords;
    const maltsString = Array.isArray(malts) ? malts.join(',') : malts;
    const hopsString = Array.isArray(hops) ? hops.join(',') : hops;
    let spicesString;
    if (spices) spicesString = Array.isArray(spices) ? spices.join(',') : spices;

    // Validate ingredients (continued)
    validator.validateIngredient(keywordsString, 'keywords');
    validator.validateIngredient(maltsString, 'malts');
    validator.validateIngredient(hopsString, 'hops');
    if (spicesString) validator.validateIngredient(spicesString, 'spices');
    validator.validateBoolean(reqBodyNormalized.active);

    // 4. Create document object
    const document = {
      name,
      description,
      keywords: separateValues(keywordsString),
      style,
      abv: parseFloat(parseFloat(abv).toFixed(2)),
      ibu: parseFloat(parseFloat(ibu).toFixed(2)),
      ebv: parseFloat(parseFloat(ebv).toFixed(2)),
      malts: separateValues(maltsString),
      hops: separateValues(hopsString),
      active,
    };
    if (spicesString && spicesString.length > 0) document.spices = separateValues(spicesString);
    
    // 5. Resize image & save to disk & update document
    const image = await processFile.resizeSavePhotos('beers', ['image', 'cover', 'aroma-web'])(document.name, reqFiles, false);
    if (image['image']) document.image = image['image'];
    if (image['cover']) document.cover = image['cover'];
    if (image['aroma-web']) document['aroma-web'] = image['aroma-web'];

    // 6. Add additional fields
    document.slug = slugify(document.name);

    // 7. Return document
    return document;
  },
};
