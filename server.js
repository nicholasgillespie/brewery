/* IMPORT MODULE //////////////////// */
import './app/utils/config.js';
import http from 'http';

/* IMPORT UNCAUGHT EXCEPTION //////////////////// */
import './app/errors/uncaughtException.js';

/* IMPORT APP //////////////////// */
import app from './app/app.js';

// flag to check if the shutdown process has started
let isShuttingDown = false;

/* CREATE SERVER //////////////////// */
const server = http.createServer(app);
const { SITE_PROTO, SITE_HOST, SITE_PORT } = process.env;

/* UNHANDLED REJECTION //////////////////// */
process.on('unhandledRejection', (reason, _) => { // removed param 'promise'
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(reason);
  isShuttingDown = true;
  // close server connection
  server.close(() => {
    process.exit(1);
  });
});

/* START SERVER //////////////////// */
try {
  server.listen(SITE_PORT, () => {
    const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    console.log(`${date} - Application running at ${SITE_PROTO}://${SITE_HOST}:${SITE_PORT}`);
  });
} catch (err) {
  console.error('Error starting server:', err);
  process.exit(1);
}

/* SIGTERM //////////////////// */
process.on('SIGTERM', () => {
  if (isShuttingDown) return;
  console.log("Received 'SIGTERM' signal, shutting down...");
  isShuttingDown = true;
  server.close(() => {
    process.exit(0);
  });
});

/* SIGINT  //////////////////// */
process.on('SIGINT', () => {
  if (isShuttingDown) return;
  console.log("Received 'SIGINT' signal, shutting down...");
  isShuttingDown = true;
  server.close(() => {
    process.exit(0);
  });
});
