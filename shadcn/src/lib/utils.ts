import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateMiddle(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;

  const half = maxLength / 2;
  return `${text.slice(0, half)}...${text.slice(-half)}`;
}
