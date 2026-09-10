import fs from 'fs';
import path from 'path';

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  location?: string;
  stampColor?: string;
  createdAt: string;
  dateFormatted: string;
}

const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL ? '/tmp/data' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'guestbook.json');
const SEED_FILE = path.join(process.cwd(), 'data', 'guestbook.json');

// Initial charming sample postcards reflecting Robin-style authentic community notes
const INITIAL_ENTRIES: GuestbookEntry[] = [
  {
    id: 'gb_seed_1',
    name: 'Harry',
    message: 'Hi Katleho! Loved browsing your UX case studies and generative pieces. The textures in your sketches have such a tactile feel. Keep making great things!',
    location: 'Johannesburg',
    stampColor: '#B8622D',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    dateFormatted: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(Date.now() - 86400000 * 3)),
  },
  {
    id: 'gb_seed_2',
    name: 'Emily',
    message: 'Stumbled upon your portfolio from your Python experiments. Really appreciate how clean the typography is and the personal touch throughout.',
    location: 'Cape Town',
    stampColor: '#3E5C76',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    dateFormatted: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(Date.now() - 86400000 * 7)),
  },
];

// Ensure directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Could not create data directory, using memory store:', err);
  }
}

// In-memory cache for ultra-fast reads and atomic sync
let cachedEntries: GuestbookEntry[] | null = null;

export function getGuestbookEntries(): GuestbookEntry[] {
  if (cachedEntries) {
    return cachedEntries;
  }

  ensureDataDir();

  // Try DB_FILE first, then SEED_FILE if running on Vercel/serverless
  const filesToCheck = [DB_FILE];
  if (IS_VERCEL && SEED_FILE !== DB_FILE) {
    filesToCheck.push(SEED_FILE);
  }

  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      try {
        const raw = fs.readFileSync(file, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedEntries = parsed;
          return cachedEntries;
        }
      } catch (err) {
        console.warn(`Failed to read ${file}:`, err);
      }
    }
  }

  cachedEntries = [...INITIAL_ENTRIES];
  try {
    saveGuestbookEntriesAtomic(cachedEntries);
  } catch {}
  return cachedEntries;
}

// Atomic update using temporary file + fs.renameSync
export function saveGuestbookEntriesAtomic(entries: GuestbookEntry[]): void {
  cachedEntries = entries;
  ensureDataDir();
  const tmpFile = path.join(DATA_DIR, `guestbook.json.tmp.${Date.now()}.${Math.random().toString(36).slice(2)}`);
  
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(entries, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.warn('Filesystem write not permitted or failed, state preserved in memory:', err);
    try {
      if (fs.existsSync(tmpFile)) {
        fs.unlinkSync(tmpFile);
      }
    } catch {}
  }
}

export function addGuestbookEntry(entry: Omit<GuestbookEntry, 'id' | 'createdAt' | 'dateFormatted'>): GuestbookEntry {
  const current = getGuestbookEntries();

  const id = `gb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date();
  const dateFormatted = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(now);

  const newEntry: GuestbookEntry = {
    id,
    name: entry.name.trim(),
    message: entry.message.trim(),
    location: entry.location ? entry.location.trim() : undefined,
    stampColor: entry.stampColor || '#B8622D',
    createdAt: now.toISOString(),
    dateFormatted,
  };

  const updated = [newEntry, ...current];
  saveGuestbookEntriesAtomic(updated);

  return newEntry;
}
