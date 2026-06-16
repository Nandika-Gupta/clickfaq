import { getItem, setItem } from './storage';

const BOOKMARKS_KEY = 'bookmarks';

export function getBookmarks(): string[] {
  return getItem<string[]>(BOOKMARKS_KEY, []);
}

export function toggleBookmark(faqId: string): boolean {
  const current = getBookmarks();
  const index = current.indexOf(faqId);
  let isBookmarked = false;
  if (index > -1) {
    current.splice(index, 1);
  } else {
    current.push(faqId);
    isBookmarked = true;
  }
  setItem(BOOKMARKS_KEY, current);
  return isBookmarked;
}

export function isBookmarked(faqId: string): boolean {
  return getBookmarks().includes(faqId);
}
