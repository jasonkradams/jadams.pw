import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
