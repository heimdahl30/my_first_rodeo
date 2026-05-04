import 'dotenv/config';
import app from './app.js';
import { connectToDB, disconnectFromDB } from './db/connection.js';

const PORT = process.env.PORT || 5000;

connectToDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on ${PORT}`);
    });

    server.on('error', async (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error('PORT already in use');
      } else {
        console.error('Server error:', err);
      }
      try {
        await disconnectFromDB();
      } catch (disError) {
        console.error(disError);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
