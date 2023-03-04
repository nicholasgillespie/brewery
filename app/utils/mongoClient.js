/* MODULES //////////////////// */
import { MongoClient } from 'mongodb';
import './config.js';

/* DATABASE URI //////////////////// */
const uri = process.env.DATABASE_URI.replaceAll(
  '<NAME>',
  process.env.DATABASE_NAME,
).replace(
  '<USER>',
  process.env.DATABASE_USER,
).replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

/* MONGODB CLIENT //////////////////// */
const client = new MongoClient(uri);

/* EXPORT //////////////////// */
export default client;
