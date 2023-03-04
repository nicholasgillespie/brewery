/* IMPORTS //////////////////// */
import path from 'path';

/* CURRENT DIRECTORY */
const directory = `${process.cwd().split('\\').slice(0, -1).join('\\')}`;
// const directory = path.dirname(new URL(import.meta.url).pathname);


// const rootDirectory = path.resolve(__dirname, '../');

// const __filename = new URL(import.meta.url).pathname;
// // const __dirname = path.dirname(__filename);
// const directory = path.dirname(path.dirname(path.dirname(__filename)));


// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);
// const directory = path.resolve(__dirname, '../../');



/* EXPORT //////////////////// */
export default directory;
