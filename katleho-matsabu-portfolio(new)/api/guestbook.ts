import type { IncomingMessage, ServerResponse } from 'http';
import { getGuestbookEntries, addGuestbookEntry } from '../server/guestbook-db.js';

// Simple in-memory rate limiting map: IP -> timestamps[]
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 10;

  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  if (req.method === 'GET') {
    try {
      const entries = getGuestbookEntries();
      return res.status(200).json({ success: true, entries });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Failed to fetch guestbook notes' });
    }
  }

  if (req.method === 'POST') {
    // Parse body if not parsed
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid JSON body' });
      }
    }

    if (!body) {
      return res.status(400).json({ success: false, error: 'Missing request body' });
    }

    // 1. Honeypot check for spam prevention
    if (body.hp_website && body.hp_website.trim() !== '') {
      // Fake success for spambots
      return res.status(200).json({
        success: true,
        entry: {
          id: 'fake',
          name: 'Anonymous',
          message: 'Received',
          dateFormatted: 'Today',
        },
      });
    }

    // 2. Rate limit check
    if (!checkRateLimit(String(ip))) {
      return res.status(429).json({
        success: false,
        error: 'Too many notes sent. Please wait a few minutes before dropping another postcard.',
      });
    }

    // 3. Validation & sanitization
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const location = typeof body.location === 'string' ? body.location.trim().slice(0, 50) : undefined;
    const stampColor = typeof body.stampColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(body.stampColor) ? body.stampColor : '#B8622D';

    if (!name || name.length < 1 || name.length > 50) {
      return res.status(400).json({ success: false, error: 'Name must be between 1 and 50 characters' });
    }

    if (!message || message.length < 3 || message.length > 280) {
      return res.status(400).json({ success: false, error: 'Note must be between 3 and 280 characters' });
    }

    try {
      const newEntry = addGuestbookEntry({
        name,
        message,
        location,
        stampColor,
      });

      return res.status(201).json({ success: true, entry: newEntry });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Failed to write note' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
