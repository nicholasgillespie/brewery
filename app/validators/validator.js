/* IMPORT ERROR HANDLER //////////////////// */
import AppError from '../errors/appError.js';

export default {
  validateBoolean(value) {
    if (value === undefined || value === null || value === '') {
      throw new AppError('Active is required.', 400);
    } else if (typeof value !== 'boolean') {
      throw new Error('Active must be either true or false.');
    }
  },

  validateAddress(address) {
    if (!address || address.trim().length === 0) {
      throw new AppError('Address is required.', 400);
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9.,:;() /'’-]+$/.test(address)) {
      throw new AppError('Address must contain only letters and numbers.', 400);
    } else if (address.length < 5) {
      throw new AppError('Address must be at least 5 characters.', 400);
    } else if (address.length > 50) {
      throw new AppError('Address must be less than 50 characters.', 400);
    }
  },

  validateCity(city) {
    if (!city || city.trim().length === 0) {
      throw new AppError('City is required.', 400);
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ- ]+$/.test(city)) {
      throw new AppError('City must contain only letters.', 400);
    } else if (city.length < 2) {
      throw new AppError('City must be at least 2 characters.', 400);
    } else if (city.length > 25) {
      throw new AppError('City must be less than 25 characters.', 400);
    }
  },

  validateCountry(country) {
    if (!country || country.trim().length === 0) {
      throw new AppError('Country is required.', 400);
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/.test(country)) {
      throw new AppError('Country must contain only letters.', 400);
    } else if (country.length < 2) {
      throw new AppError('Country must be at least 2 characters.', 400);
    } else if (country.length > 25) {
      throw new AppError('Country must be less than 25 characters.', 400);
    }
  },

  validateDate(date) {
    if (!date || date.trim().length === 0) {
      throw new AppError('Date is required.', 400);
    } else if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) {
      throw new AppError('Date must be in the format DD-MM-YYYY.', 400);
    }
  },

  validateDescription(description) {
    if (!description || description.trim().length === 0) {
      throw new AppError('Description is required.', 400);
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9.,:;!?()% \-«»'’&]+$/.test(description)) {
      throw new AppError('Description must contain only letters and numbers.', 400);
    } else if (description.length < 20) {
      throw new AppError('Description must be at least 20 characters.', 400);
    } else if (description.length > 500) {
      throw new AppError('Description must be less than 500 characters.', 400);
    }
  },

  validateEmail(email) {
    if (!email || email.trim().length === 0) {
      throw new AppError('Email is required.', 400);
    } else if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/.test(email)) {
      throw new AppError('Email is invalid.', 400);
    }
  },

  validateFileImage(reqFile, array) {
    if (!reqFile || !reqFile.fieldname) {
      throw new AppError('Image is required.', 400);
    } else if (!reqFile.mimetype.startsWith('image')) {
      throw new AppError('Uploaded file is not an image.', 400);
    } else if (!array.includes(reqFile.fieldname)) {
      throw new AppError('Image field name is invalid.', 400);
    }
  },

  validateFileImages(reqFiles, fieldNames, isNewRecord = true) {
    fieldNames.forEach(fieldName => {
      const files = reqFiles[fieldName];
      if (!files || !Array.isArray(files) || files.length === 0) {
        if (isNewRecord) {
          throw new AppError(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`, 400); 
        }
        return;
      }
      files.forEach(file => {
        if (!file.mimetype.startsWith('image')) {
          throw new AppError(`Uploaded ${fieldName} is not an image.`, 400);
        } else if (!file.fieldname || !fieldNames.includes(file.fieldname)) {
          throw new AppError(`Field name for uploaded ${fieldName} is invalid.`, 400);
        }
      });
    });
  },
  

  validateFirstname(firstname) {
    if (!firstname || firstname.trim().length === 0) {
      throw new AppError('Firstname is required.', 400);
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/.test(firstname)) {
      throw new AppError('Firstname must contain only letters.', 400);
    } else if (firstname.length < 2) {
      throw new AppError('Firstname must be at least 2 characters.', 400);
    } else if (firstname.length > 20) {
      throw new AppError('Firstname must be less than 20 characters.', 400);
    }
  },

  validateIngredient(value, field) {
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
    if (field === 'spices' && (!value || value.trim().length === 0)) return;
    if (!value || value.trim().length === 0) {
      throw new AppError(`${capitalizedField} is required.`, 400);
    } else {
      const ingredientArray = value.split(',').map((ingredient) => ingredient.trim());
      const validationRegExp = field === 'hops'
        ? /^[a-zA-Z0-9À-ÖØ-öø-ÿ '’-]+$/
        : /^[a-zA-ZÀ-ÖØ-öø-ÿ '’-]+$/;
      if (ingredientArray.some((ingredient) => !validationRegExp.test(ingredient))) {
        throw new AppError(`${capitalizedField} must contain only letters, numbers, and accents.`, 400);
      } else if (ingredientArray.some((ingredient) => ingredient.length < 2)) {
        throw new AppError(`Each ${field} must be at least 2 characters.`, 400);
      } else if (ingredientArray.some((ingredient) => ingredient.length > 20)) {
        throw new AppError(`Each ${field} must be less than 20 characters.`, 400);
      }
    }
  },  

  validateMessage(message) {
    if (!message || message.trim().length === 0) {
      throw new AppError('Message is required.', 400);
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9.,:;!?()% \-«»'’&@.]+$/.test(message)) {
      throw new AppError('Message must contain only letters, numbers, and email address characters.', 400);
    } else if (message.length < 20) {
      throw new AppError('Message must be at least 20 characters.', 400);
    } else if (message.length > 500) {
      throw new AppError('Message must be less than 500 characters.', 400);
    }
  },  

  validateName(name) {
    if (!name || name.trim().length === 0) {
      throw new AppError('Name is required.', 400);
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 ]+$/.test(name)) {
      throw new AppError('Name must contain only letters.', 400);
    } else if (name.length < 2) {
      throw new AppError('Name must be at least 2 characters.', 400);
    } else if (name.length > 25) {
      throw new AppError('Name must be less than 25 characters.', 400);
    }
  },

  validateNumericalValue(value, field) {
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
    if (value === undefined || value === null || value === '') {
      throw new AppError(`${capitalizedField} is required.`, 400);
    } else if (!/^[0-9]+([.][0-9]+)?$/.test(value)) {
      throw new AppError(`${capitalizedField} must contain only numbers and a decimal point (if applicable).`, 400);
    } else {
      const valueStr = value.toString();
      if (valueStr.endsWith('.00')) {
        value = valueStr.slice(0, -3);
      }
    }
  },

  validatePassword(password) {
    if (!password || password.trim().length === 0) {
      throw new AppError('Password is required.', 400);
    } else if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters.', 400);
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      throw new AppError('Password must contain at least one lowercase letter, one uppercase letter, and one digit.', 400);
    }
  },

  validatePasswordConfirm(passwordConfirm, password) {
    if (!passwordConfirm || passwordConfirm.trim().length === 0) {
      throw new AppError('Password confirm is required.', 400);
    } else if (password !== passwordConfirm) {
      throw new AppError('Passwords do not match.', 400);
    }
  },

  validatePostalCode(postalCode) {
    if (!/^[0-9]{5}$/.test(postalCode)) {
      throw new AppError('Postal code must be in the format 75000.', 400);
    }
  },

  validateSlug(slug) {
    if (!slug || slug.trim().length === 0) {
      throw new AppError('Slug is required.', 400);
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new AppError('Slug must contain only lowercase letters, numbers and hyphens.', 400);
    } else if (slug.length < 2) {
      throw new AppError('Slug must be at least 2 characters.', 400);
    } else if (slug.length > 20) {
      throw new AppError('Slug must be less than 20 characters.', 400);
    }
  },

  validateSurname(surname) {
    if (!surname || surname.trim().length === 0) {
      throw new AppError('Surname is required.', 400);
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/.test(surname)) {
      throw new AppError('Surname must contain only letters.', 400);
    } else if (surname.length < 2) {
      throw new AppError('Surname must be at least 2 characters.', 400);
    } else if (surname.length > 20) {
      throw new AppError('Surname must be less than 20 characters.', 400);
    }
  },

  validateSocialMedia(account, field) {
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
    if (!account || account.trim().length === 0) {
      throw new AppError(`${capitalizedField} is required.`, 400);
    } else if (!/^https?:\/\/(www\.)?(facebook|instagram|twitter|youtube)\.[a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)?(\/[a-zA-Z0-9-_]+)*\/?$/.test(account)) {
      throw new AppError(`${capitalizedField} must be a valid URL for either Facebook, Instagram, Twitter, or YouTube.`, 400);
    } else if (account.length < 15) {
      throw new AppError(`${capitalizedField} must be at least 15 characters.`, 400);
    } else if (account.length > 100) {
      throw new AppError(`${capitalizedField} must be less than 100 characters.`, 400);
    }
  },

  validateStyle(style) {
    if (!style || style.trim().length === 0) {
      throw new AppError('Style is required.', 400);
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/.test(style)) {
      throw new AppError('Style must contain only letters.', 400);
    } else if (style.length < 2) {
      throw new AppError('Style must be at least 2 characters.', 400);
    } else if (style.length > 20) {
      throw new AppError('Style must be less than 20 characters.', 400);
    }
  },

  validateTime(time) {
    if (!time || time.trim().length === 0) {
      throw new AppError('Time is required.', 400);
    } else if (!/^[0-9]{2}:[0-9]{2}$/.test(time)) {
      throw new AppError('Time must be in the format HH:MM.', 400);
    }
  },

  validateTitle(title) {
    if (!title || title.trim().length === 0) {
      throw new AppError('Title is required.', 400);
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9.,:() '’&-]+$/.test(title)) {
      throw new AppError('Title must contain only letters and numbers.', 400);
    } else if (title.length < 5) {
      throw new AppError('Title must be at least 5 characters.', 400);
    } else if (title.length > 50) {
      throw new AppError('Title must be less than 50 characters.', 400);
    }
  },

  validateType(type) {
    if (!type || type.trim().length === 0) {
      throw new AppError('Type is required.', 400);
    } else if (type !== 'actu' && type !== 'event') {
      throw new AppError('Type must be either "actu" or "event".', 400);
    }
  },

  validateWebsite(website) {
    if (!website || website.trim().length === 0) {
      throw new AppError('Website is required.', 400);
    } else if (!/^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?].*)?$/.test(website)) {
      throw new AppError('Website must be a valid URL. Format: http://www.example.com.', 400);
    } else if (website.length < 10) {
      throw new AppError('Website must be at least 10 characters.', 400);
    } else if (website.length > 50) {
      throw new AppError('Website must be less than 50 characters.', 400);
    }
  },
};
