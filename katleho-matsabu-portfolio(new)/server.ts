import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getGuestbookEntries, addGuestbookEntry } from './server/guestbook-db.js';

const app = express();
const PORT = 3000;

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple in-memory rate limiter for server
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 12;

  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Guestbook GET
app.get('/api/guestbook', (req, res) => {
  try {
    const entries = getGuestbookEntries();
    res.json({ success: true, entries });
  } catch (err) {
    console.error('Failed to get entries:', err);
    res.status(500).json({ success: false, error: 'Internal server error reading guestbook' });
  }
});

// Guestbook POST
app.post('/api/guestbook', (req, res) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  // 1. Honeypot check
  if (req.body.hp_website && req.body.hp_website.trim() !== '') {
    // Return fake success for bot
    return res.json({
      success: true,
      entry: {
        id: 'fake_bot_entry',
        name: 'Guest',
        message: 'Received',
        dateFormatted: 'Today',
      },
    });
  }

  // 2. Rate limit
  if (!checkRateLimit(String(ip))) {
    return res.status(429).json({
      success: false,
      error: 'Too many notes sent. Please wait a few minutes before dropping another postcard.',
    });
  }

  // 3. Validation
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  const location = typeof req.body.location === 'string' ? req.body.location.trim().slice(0, 50) : undefined;
  const stampColor = typeof req.body.stampColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(req.body.stampColor) ? req.body.stampColor : '#B8622D';

  if (!name || name.length < 1 || name.length > 50) {
    return res.status(400).json({ success: false, error: 'Name must be between 1 and 50 characters.' });
  }

  if (!message || message.length < 3 || message.length > 280) {
    return res.status(400).json({ success: false, error: 'Note must be between 3 and 280 characters.' });
  }

  try {
    const newEntry = addGuestbookEntry({
      name,
      message,
      location,
      stampColor,
    });

    res.status(201).json({ success: true, entry: newEntry });
  } catch (err) {
    console.error('Failed to create guestbook entry:', err);
    res.status(500).json({ success: false, error: 'Failed to write note to datastore.' });
  }
});

// Coming soon route helper
app.get('/coming-soon', (req, res) => {
  res.redirect('/coming-soon.html');
});

// Serve public assets (stories PDFs, images, icons) directly with proper MIME types
app.use(express.static(path.join(process.cwd(), 'public')));

// Vite middleware in dev or static serving in prod
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic();
