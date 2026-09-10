# Story PDFs Folder

Place your story manuscripts, PDF articles, or digital zines in this folder (`/public/stories/`).

### How It Works:
When visitors click **"Read the story →"** on your portfolio, the story opens directly **on your website in an online article reader**!
Visitors can:
1. **Read in Article View**: An elegant, distraction-free editorial layout formatted like an online publication (typography in Fraunces & Inter, chapter excerpts, progress indicator, comfortable margins).
2. **Switch to PDF View**: An embedded interactive PDF document viewer with zoom, page navigation, print, and full-screen controls.
3. **Download or Open Separately**: Quick action buttons to download the PDF or open it in a separate tab.

### Quick Naming Convention:
- `story-1.pdf`
- `story-2.pdf`
- `[your-custom-name].pdf`

### How to link in code:
Open `src/data/portfolioData.ts` and set `pdfUrl` on the corresponding item in `STORIES`:
```ts
{
  id: 'story-1',
  title: 'Story title one',
  teaser: 'A one or two line teaser of what this story is about...',
  coverImage: '/images/writing/story-1.webp',
  pdfUrl: '/stories/story-1.pdf', // points directly to this folder
  date: 'March 2025',
  readTime: '4 min read',
  fullText: [
    'First paragraph of your story or excerpt...',
    'Second paragraph...',
  ],
}
```
If you haven't uploaded a PDF yet, the in-site article reader seamlessly presents the formatted article text and informs the visitor that the document is in transcription mode.
