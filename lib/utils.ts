import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convert ISO 8601 duration (e.g. "PT1H30M") to a readable string ("1h 30min") */
export function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const hours = match[1] ? `${match[1]}h ` : '';
  const mins = match[2] ? `${match[2]}min` : '';
  return (hours + mins).trim() || iso;
}

export function buildTagUrl(basePath: string, activeTags: string[], clickedTag: string): string {
  const next = activeTags.includes(clickedTag)
    ? activeTags.filter(t => t !== clickedTag)
    : [...activeTags, clickedTag];

  if (next.length === 0) return basePath;
  const params = new URLSearchParams();
  next.forEach(t => params.append('tag', t));
  return `${basePath}?${params.toString()}`;
}
