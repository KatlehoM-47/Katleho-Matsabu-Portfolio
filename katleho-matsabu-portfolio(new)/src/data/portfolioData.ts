import { ProjectItem, GalleryTileItem, PieceTileItem, StoryItem, ContactLinkItem } from '../types.ts';

export const HERO_DATA = {
  name: 'Katleho Matsabu',
  role: 'Junior Developer & UX Designer',
  headlineParts: [
    { text: "Hey, I'm Katleho Matsabu — a Junior Developer", emoji: '💻' },
    { text: ' & UX Designer', emoji: '🎨' },
    { text: ' who dabbles in the arts', emoji: '🎭' },
    { text: '.', emoji: '' },
  ],
  bioNote:
    "This is my personal website. A space where I express my thoughts, ideas and work without intervention — a little world that can't be reduced to modern standards or social media's policies. I hope you enjoy this body of work as much as I enjoyed making it.",
  roleTags: [
    { label: 'Python', icon: '🐍' },
    { label: 'UX Design', icon: '✨' },
    { label: 'Sketching', icon: '✏️' },
    { label: '3D Art', icon: '🧊' },
    { label: 'Photography', icon: '📷' },
    { label: 'Short Stories', icon: '📖' },
  ],
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    year: '2026',
    name: 'This Portfolio',
    tags: 'Website · Design',
    href: '#',
  },
  {
    id: 'proj-2',
    year: '2025',
    name: 'Replace with your project name',
    tags: 'Python · Tool',
    href: '#',
  },
  {
    id: 'proj-3',
    year: '2025',
    name: 'Replace with your project name',
    tags: 'UX Design · Case Study',
    href: '#',
  },
  {
    id: 'proj-4',
    year: 'Coming soon',
    name: 'Something new',
    tags: 'In progress',
    href: 'coming-soon.html',
    inProgress: true,
  },
];

// Uneven masonry gallery tiles with varying heights
// Drop images into /public/images/gallery/ (e.g. photo-1.webp) to display real photos.
// If the image file doesn't exist yet, it will automatically fall back to the gradient.
export const INITIAL_GALLERY_TILES: GalleryTileItem[] = [
  {
    id: 'gal-1',
    title: '01',
    subtitle: 'Golden Hour Study',
    imageUrl: '/images/gallery/Aftermath.jpg',
    gradient: 'linear-gradient(160deg, #c96b3c 0%, #3e5c76 100%)',
    heightClass: 'h-[320px] md:h-[360px]',
  },
  {
    id: 'gal-2',
    title: '02',
    subtitle: 'Warm Architectural Shadows',
    imageUrl: '/images/gallery/Life.jpg',
    gradient: 'linear-gradient(160deg, #e0c07a 0%, #8a9a5b 100%)',
    heightClass: 'h-[220px] md:h-[250px]',
  },
  {
    id: 'gal-3',
    title: '03',
    subtitle: 'High Contrast Geometry',
    imageUrl: '/images/gallery/Moments.jpg',
    gradient: 'linear-gradient(160deg, #3e5c76 0%, #1c1b19 100%)',
    heightClass: 'h-[270px] md:h-[300px]',
  },
  {
    id: 'gal-4',
    title: '04',
    subtitle: 'Clay & Ochre Textures',
    imageUrl: '/images/gallery/Sunday_skies.jpg',
    gradient: 'linear-gradient(160deg, #b8622d 0%, #e0c07a 100%)',
    heightClass: 'h-[350px] md:h-[400px]',
  },
];

// Art pieces and sketches
// Drop scans/renders into /public/images/pieces/ (e.g. piece-1.webp)
// Falls back cleanly to tactile drawing/3D vector icons if not placed yet.
export const INITIAL_PIECES_TILES: PieceTileItem[] = [
  {
    id: 'piece-1',
    title: 'Sketch 01',
    type: 'Pencil on Cotton Paper',
    previewColor: 'var(--paper-raised)',
    imageUrl: '/images/pieces/Iridescence.jpg',
  },
  {
    id: 'piece-2',
    title: '3D piece',
    type: 'Blender & Shaders',
    previewColor: 'var(--paper-raised)',
    imageUrl: '/images/pieces/Life_and_death.jpg',
  },
  {
    id: 'piece-3',
    title: 'Sketch 02',
    type: 'Ink & Crosshatch',
    previewColor: 'var(--paper-raised)',
    imageUrl: '/images/pieces/Personal.jpg',
  },
  {
    id: 'piece-4',
    title: '3D piece',
    type: 'Procedural Form',
    previewColor: 'var(--paper-raised)',
    imageUrl: '/images/pieces/piece-4.webp',
  },
];

// Short stories & fragments
// Drop story cover photos/illustrations into /public/images/writing/ (e.g. story-1.webp)
// Drop story PDF manuscripts into /public/stories/ (e.g. story-1.pdf)
export const STORIES: StoryItem[] = [
  {
    id: 'story-1',
    title: 'Story title one',
    subtitle: 'Observations on architecture, shadows, and quiet afternoons',
    teaser: 'A one or two line teaser of what this story is about, just enough to pull someone in.',
    coverImage: '/images/writing/story-1.webp',
    pdfUrl: '/stories/the-bar-convocation.pdf',
    date: 'February 2025',
    readTime: '4 min read',
    fullText: [
      'The morning came with a pale ochre light that stretched across the floorboards like watered ink. There was no urgency in the room—only the soft hum of the radiator and the deliberate rhythm of charcoal moving across heavy paper.',
      'We spent hours discussing whether a building ever truly belongs to the architect who drafted it, or if it gradually surrenders its memory to the people who walk through its hallways in silence.',
      'By noon, the shadows had sharpened into neat angles against the wall. Every line drawn seemed both permanent and fragile, waiting for an eraser or a gust of wind.',
    ],
  },
  {
    id: 'story-2',
    title: 'Story title two',
    subtitle: 'Fragments from a sketchbook kept over several rainy seasons',
    teaser: 'Another short teaser — replace with a real excerpt once the piece is ready to share.',
    coverImage: '/images/writing/story-2.webp',
    pdfUrl: '/stories/story-2.pdf',
    date: 'January 2025',
    readTime: '3 min read',
    fullText: [
      'Rain has a way of resetting the texture of the city. Colors that usually feel loud soften into slate blues, burnt umber, and muted creams.',
      'I kept this notebook in a canvas jacket pocket. Some pages are wrinkled from drops that sneaked in before the clasp clicked shut. Looking back, those smudged lines are the ones that carry the most truth.',
      'To build something digital that retains this tactile grain is the quiet ambition behind every project on this shelf.',
    ],
  },
];

export const CONTACT_LINKS: ContactLinkItem[] = [
  {
    label: 'Email',
    value: 'kmatsabu0@gmail.com',
    href: 'mailto:kmatsabu0@gmail.com',
  },
  {
    label: 'Phone',
    value: '081 465 7566',
    href: 'tel:+27814657566',
  },
  {
    label: 'LinkedIn',
    value: 'katleho-matsabu',
    href: 'https://www.linkedin.com/in/katleho-matsabu-7861503b1',
    isExternal: true,
  },
];
