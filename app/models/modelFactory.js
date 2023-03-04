/* IMPORT DATABASE //////////////////// */
import client from '../utils/mongoClient.js';

// /* DATABASE CONFIG //////////////////// */
const db = (collection) => client.db(process.env.DATABASE_NAME).collection(collection);

/* EXPORT //////////////////// */
export default {
  async find(collection, document, options) {
    // prepare query & options
    const documentToFind = document || {};
    const projection = options.project ? options.project : {};
    const sort = options.sort ? options.sort : {};
    const limit = options.limit ? options.limit : {};

    // find documents in database
    const cursor = db(collection).find(documentToFind, { projection, sort, limit });
    const result = await cursor.toArray();

    // return response;
    return result;
  },

  async findOne(collection, document, options) {
    // prepare query & options
    const documentToFind = document || {};
    const projection = options.project ? options.project : {};

    // find document in database
    const result = await db(collection).findOne(documentToFind, { projection });

    // return response;
    return result;
  },

  async insertOne(collection, document) {
    // insert document in database
    const result = await db(collection).insertOne(document);

    // treat & prepare response
    const statusCode = result.acknowledged === true ? 201 : 400;
    const message = result.acknowledged === true
      ? `${collection.slice(0, -1)} created. ID: ${result.insertedId}.`
      : `${collection.slice(0, -1)} not created.`;
    const status = result.acknowledged === true ? 'success' : 'fail';

    // log action to console
    console.log(message);

    // return response
    result.message = message;
    result.statusCode = statusCode;
    result.status = status;
    return result;
  },

  async updateOne(collection, document, update, projection) {
    // document to be updated
    const currentDocument = await db(collection).findOne(document, projection);
    if (!currentDocument) return;

    let updatedocument = { $set: update };

    // block dealing with resetPassword functionality
    if (currentDocument.passwordResetToken && update.password) {
      updatedocument = {
        $unset: { passwordResetToken: undefined, passwordResetExpires: undefined },
        $set: { password: update.password, passwordChangedAt: update.passwordChangedAt },
      };
    }

    // update document in database
    const result = await db(collection).updateOne(document, updatedocument);

    // treat & prepare response
    let statusCode;
    let message;
    let status;
    if (update.active === false && result.acknowledged === true) {
      statusCode = 200;
      message = `${collection.slice(0, -1)} deactivated. ID: ${currentDocument._id}.`;
      status = 'success';
    } else {
      statusCode = result.acknowledged === true ? 200 : 400;
      message = result.acknowledged === true && result.modifiedCount === 1
        ? `${collection.slice(0, -1)} updated. ID: ${currentDocument._id}.`
        : `${collection.slice(0, -1)} not updated. ID: ${currentDocument._id}.`;
      if (result.acknowledged === true) {
        if (result.modifiedCount === 1) { status = 'success'; } else { status = 'warning'; }
      } else { status = 'fail'; }
    }

    // log action to console
    console.log(message);

    // return response
    result.message = message;
    result.statusCode = statusCode;
    result.status = status;
    return result;
  },

  async unsetOne(collection, document, update) {
    const documentToUpdate = document;
    const updatedocument = { $unset: update };

    // update document in database
    const result = await db(collection).updateOne(document, updatedocument);

    // log action to console & return response
    console.log(result);
    console.log(`${collection.slice(0, -1)} updated. ID: ${documentToUpdate._id}.`);
    return result;
  },

  async deleteOne(collection, document) {
    // document to find
    const documentToFind = await db(collection).findOne(document);
    if (!documentToFind) return;

    // delete document in database
    const result = await db(collection).deleteOne(document);

    // treat & prepare response
    const statusCode = result.acknowledged === true ? 204 : 400;
    const message = result.acknowledged === true
      ? `${collection.slice(0, -1)} deleted. ID: ${documentToFind._id}.`
      : `${collection.slice(0, -1)} not deleted. ID: ${documentToFind._id}.`;
    const status = result.acknowledged === true ? 'success' : 'fail';

    // log action to console
    console.log(message);

    // return response
    result.message = message;
    result.statusCode = statusCode;
    result.status = status;
    return result;
  },

  async insertMany(collection, documents) {
    // insert document in database
    const result = await db(collection).insertMany(documents);
    // log action to console & return response
    // eslint-disable-next-line max-len
    console.log(`${collection.charAt(0).toUpperCase() + collection.slice(1)} created. Inserted: ${result.deletedCount} ${collection}.`);
    return result;
  },

  async deleteMany(collection) {
    // delete documents in database
    const result = await db(collection).deleteMany();
    // log action to console & return response
    // eslint-disable-next-line max-len
    console.log(`${collection.charAt(0).toUpperCase() + collection.slice(1)} deleted. Deleted: ${result.deletedCount} ${collection}.`);
    return result;
  },
};
