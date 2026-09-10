export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  location?: string;
  stampColor?: string;
  createdAt: string;
  dateFormatted: string;
}

export interface ProjectItem {
  id: string;
  year: string;
  name: string;
  tags: string;
  href: string;
  inProgress?: boolean;
}

export interface GalleryTileItem {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  heightClass: string;
  imageUrl?: string;
}

export interface PieceTileItem {
  id: string;
  title: string;
  type: string;
  previewColor: string;
  imageUrl?: string;
  alt?: string;
}

export interface StoryItem {
  id: string;
  title: string;
  teaser: string;
  href?: string;
  coverImage?: string;
  alt?: string;
  pdfUrl?: string;
  date?: string;
  readTime?: string;
  subtitle?: string;
  fullText?: string[];
}

export interface ContactLinkItem {
  label: string;
  value: string;
  href: string;
  isExternal?: boolean;
}
