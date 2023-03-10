// import the Multer module
import multer from 'multer';
import AppError from '../errors/appError.js';

// // create a Multer storage engine that stores files in memory
// const storage = multer.memoryStorage();

// // create a Multer instance with the memory storage engine
// const upload = multer({ storage: storage });

// // define a middleware function to handle file uploads
// const uploadMiddleware = upload.single('image');

// // export the middleware function for use in a router
// // export default uploadMiddleware;

// let fileLocation, fieldName;

export default {
  storeFile(field) {
    console.log('field: ', field);
    const test = field.length === 1 ? 'single' : 'array';
    console.log('test: ', test);
    const multerStorage = multer.memoryStorage();
    const multerFileFilter = (req, file, cb) => {
      if (file.mimetype.startsWith('image')) cb(null, true);
      else cb(new AppError('Not an image! Please upload only images.', 400), false);
    };
    const upload = multer({ storage: multerStorage, fileFilter: multerFileFilter });
    const uploadFunction = field.length === 1 
      ? upload.single(field) 
      : upload.array(field);

    return uploadFunction;
  },

  // async processFile(req, res, next) {
  //   console.log('fileLocation: ', fileLocation);
  //   console.log('fieldName: ', fieldName);
  //   const files = Array.isArray(req.files) ? req.files : [req.file];
  //   if (!files || files.length === 0) {
  //     return next(new AppError('No files uploaded', 400));
  //   }
  //   try {
  //     const promises = files.map(file => {
  //       return sharp(file.buffer)
  //         .resize(width, height)
  //         .toFormat('jpeg')
  //         .jpeg({ quality: 90 })
  //         .toFile(`app/public/img/${fileLocation}s/${Date.now()}-${fieldName}-${file.originalname}`);
  //     });
  //     const result = await Promise.all(promises);
  //     next();
  //   } catch (err) {
  //     next(new AppError(`Error processing file${files.length > 1 ? 's' : ''}: ${err.message}`, 400));
  //   }
  // }
};


// const processFile = (fileLocation, fieldName) => {
//   const multerStorage = multer.memoryStorage();
//   const multerFileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) cb(null, true);
//     else cb(new AppError('Not an image! Please upload only images.', 400), false);
//   };
//   const upload = multer({ storage: multerStorage, fileFilter: multerFileFilter });
//   const sizes = { 
//     'image': { width: 500, height: 500 }, 
//     'cover': { width: 1080, height: 280 }, 
//     'aroma-web': { width: 400, height: 400 } };
//   const { width, height } = sizes[fieldName];
//   const uploadFunction = fieldName.length === 1 
//     ? upload.single(fieldName) 
//     : upload.array(fieldName);

//   return [ uploadFunction, async (req, res, next) => {
//     const files = Array.isArray(req.files) ? req.files : [req.file];
//     if (!files || files.length === 0) {
//       return next(new AppError('No files uploaded', 400));
//     }
//     try {
//       const promises = files.map(file => {
//         return sharp(file.buffer)
//           .resize(width, height)
//           .toFormat('jpeg')
//           .jpeg({ quality: 90 })
//           .toFile(`app/public/img/${fileLocation}s/${Date.now()}-${fieldName}-${file.originalname}`);
//       });
//       const result = await Promise.all(promises);
//       next();
//     } catch (err) {
//       next(new AppError(`Error processing file${files.length > 1 ? 's' : ''}: ${err.message}`, 400));
//     }
//   } ];
// };

// export default processFile;


// import multer from 'multer';
// import sharp from 'sharp';
// import AppError from '../errors/appError.js';

// function processFile(fileLocation, fieldName) {
//   const multerStorage = multer.memoryStorage();
//   const multerFileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) cb(null, true);
//     else cb(new AppError('Not an image! Please upload only images.', 400), false);
//   };
//   const upload = multer({ storage: multerStorage, fileFilter: multerFileFilter });

//   const sizes = {
//     'image': { width: 500, height: 500 },
//     'cover': { width: 1080, height: 280 },
//     'aroma-web': { width: 400, height: 400 },
//   };
//   const { width, height } = sizes[fieldName];

//   if (fieldName.length === 1) {
//     return [
//       upload.single(fieldName),
//       (req, res, next) => {
//         if (!req.file) {
//           return next(new AppError('No file uploaded', 400));
//         }
//         sharp(req.file.buffer)
//           .resize(width, height)
//           .toFormat('jpeg')
//           .jpeg({ quality: 90 })
//           .toFile(`app/public/img/${fileLocation}s/${Date.now()}-${fieldName}-${req.file.originalname}`)
//           .then(result => {
//             console.log(result); // add this line to log the result
//             next();
//           })
//           .catch(err => {
//             console.error(err);
//             next(new AppError(`Error processing file: ${err.message}`, 400));
//           });
//       },
//     ];
//   } else {
//     return [
//       upload.array(fieldName),
//       (req, res, next) => {
//         if (!req.files || req.files.length === 0) {
//           return next(new AppError('No files uploaded', 400));
//         }
//         Promise.all(
//           req.files.map(file => {
//             return sharp(file.buffer)
//               .resize(width, height)
//               .toFormat('jpeg')
//               .jpeg({ quality: 90 })
//               .toFile(`app/public/img/${fileLocation}s/${Date.now()}-${fieldName}-${file.originalname}`)
//               .catch(err => {
//                 console.error(err);
//                 throw new AppError(`Error processing file ${file.filename}: ${err.message}`, 400);
//               });
//           })
//         )
//           .then(result => {
//             console.log(result); // add this line to log the result
//             next();
//           })
//           .catch(err => {
//             console.error(err);
//             next(new AppError(`Error processing files: ${err.message}`, 400));
//           });
//       },
//     ];
//   }
// }

// export default processFile;



// import multer from 'multer';
// import sharp from 'sharp';
// import AppError from '../errors/appError.js';

// export default {
//   multer(fileLocation, ...fieldName) {

//     const multerStorage = multer.memoryStorage(); /* image is stored in buffer */
//     const multerFileFilter = (req, file, cb) => {
//       if (file.mimetype.startsWith('image')) cb(null, true);
//       else cb(new AppError('Not an image! Please upload only images.', 400), false);
//     };
//     const upload = multer({ storage: multerStorage, fileFilter: multerFileFilter });

//     if (fieldName.length === 1) {
//       // insert code to handle single file
//       console.log('HERE 1');
//       return upload.single(fieldName);
//     } else {
//       // insert code to handle multiple files
//       console.log('HERE 2');
//       return upload.array(fieldName);
//     }
//   },

//   sharp(fieldName) {
//     const sizes = {
//       'image': { width: 500, height: 500 },
//       'cover': { width: 1080, height: 280 },
//       'aroma-web': { width: 400, height: 400 },
//     };
//     const { width, height } = sizes[fieldName];
//     return sharp()
//             .resize(width, height)
//             .toFormat('jpeg')
//             .jpeg({ quality: 90 })
//             .toFile(`app/public/img/${fieldName}s/${file.filename}`);
//   },  
// }

    // const multerStorage = multer.diskStorage({
    //   destination: (req, file, cb) => {
    //     cb(null, `app/public/img/${fileLocation}s`);
    //   },
    //   filename: (req, file, cb) => {
    //     const ext = file.mimetype.split('/')[1];
    //     cb(null, `${fileLocation}-${Date.now()}.${ext}`);
    //   },
    // });

          // upload[fieldName.length === 1 ? 'single' : 'array'](...fieldName),
          // (req, res, next) => {
          //   if (req.files) req.body.files = req.files;
          //   else if (req.file) req.body.file = req.file;
          //   next();
          // },

// const multerStorage = multer.memoryStorage();

// const storage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an image! Please upload only images.', 400), false);
//   }
// };

// const upload = multer({ storage, fileFilter: multerFilter });

// const imageProcess = {
//   action(fileLocation, fieldName) {
//     return [
//       upload.fields([{ name: fieldName, maxCount: 1 }, { name: `${fieldName}-web`, maxCount: 1 }]),
//       async (req, res, next) => {
//         try {
//           if (!req.files || !req.files[fieldName]) return next();
          
//           const files = Array.isArray(req.files[fieldName]) ? req.files[fieldName] : [req.files[fieldName]];
//           const processedImages = await Promise.all(files.map(async (file) => {
//             const imageBuffer = file.buffer;
//             const filename = `${fileLocation}-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
            
//             await sharp(imageBuffer)
//               .resize(2000, 1333, { fit: 'cover', position: 'top' })
//               .toFormat('jpeg')
//               .jpeg({ quality: 90 })
//               .toFile(`${__dirname}/../public/img/${filename}`);
              
//             return filename;
//           }));

//           req.body[fieldName] = processedImages[0];
//           req.body[`${fieldName}-web`] = processedImages[1];
//           next();
//         } catch (err) {
//           next(err);
//         }
//       },
//     ];
//   },
// };

// export default imageProcess;
