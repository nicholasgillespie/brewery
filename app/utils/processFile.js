/* MULTER & SHARP //////////////////// */
import multer from 'multer';
import sharp from 'sharp';
/* IMPORT ERROR HANDLER //////////////////// */
import AppError from '../errors/appError.js';
import { slugify } from './helpers.js';

/* MULTER CONFIG //////////////////// */

/* EXPORT //////////////////// */
export default {
  uploadPhoto(...fieldNames) {
    const multerStorage = multer.memoryStorage();
    const upload = multer({ storage: multerStorage });
    return (Array.isArray(fieldNames) && fieldNames.length > 1) 
      ? upload.fields(fieldNames.map(name => ({ name, maxCount: 1 }))) 
      : upload.single(fieldNames);
  },  

  resizeSavePhoto(path, fieldName) {
    const sizes = {
      'image': [500, 500],
      'cover': [1200, 800],
      'aroma-web': [400, 400]
    };
    return async (value, reqFile) => {
      try {
        const [width, height] = sizes[fieldName];
        reqFile.filename = `${slugify(value)}-${fieldName}-${Date.now()}.jpeg`;
        await sharp(reqFile.buffer)
          .resize(width, height)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`app/public/img/${path}/${reqFile.filename}`);
      } catch (error) {
        throw new AppError('Error while saving image', 500);
      }
    };
  },   

  resizeSavePhotos(path, fieldNames) {
    const sizes = {
      'image': [500, 500],
      'cover': [1200, 800],
      'aroma-web': [400, 400]
    };
    return async (value, reqFiles, isNewRecord = true) => {
      try {
        const images = {};
        for (const fieldName of fieldNames) {
          if (isNewRecord || (reqFiles[fieldName] && reqFiles[fieldName].length > 0)) {
            const [width, height] = sizes[fieldName];
            const fileObject = reqFiles[fieldName] && reqFiles[fieldName][0]; // Extract the file object if it exists
            if (fileObject) {
              const filename = `${slugify(value)}-${fieldName}-${Date.now()}.jpeg`;
              await sharp(fileObject.buffer) // Use the buffer property of the file object
                .resize(width, height)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`app/public/img/${path}/${filename}`);
              images[fieldName] = filename;
            } else if (!isNewRecord) {
              // If the field is not a new record and there is no file, set the image field to null
              images[fieldName] = null;
            }
          }
        }
        return images;
      } catch (error) {
        throw new AppError('Error while saving images', 500);
      }
    };
  },
  
};