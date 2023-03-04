/* DATABASE INSTANCE //////////////////// */
import client from './mongoClient.js';

/* TEST DB CONNECTION //////////////////// */
const main = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
    const dbs = await client.db().admin().listDatabases();
    console.table(dbs.databases);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

main()
  .catch((err) => console.log(err))
  .finally(() => client.close());
