import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import config from './config.js';

const app = express();
const port = config.PORT;

// Enable CORS
const corsOptions = {
  origin: config.FRONTEND_URL
}

// use cors middleware
app.use(cors(corsOptions));

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the "web/chat" directory
app.use(express.static(path.join(__dirname, 'web/chat')));

app.get('/config', (req, res) => {
  res.json({
    API_BASE_URL: config.API_BASE_URL,
    FRONTEND_URL: config.FRONTEND_URL
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/chat', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}\nor at ${config.FRONTEND_URL}`);
});