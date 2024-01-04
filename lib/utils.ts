import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toSorted = (nums: number[]) => [...nums].sort((a, b) => a - b);
export const removeDuplicates = (nums: number[]) => [...new Set<number>(nums)];
export const concat = (oldNums: number[]) => (newNums: number[]) =>
  [...oldNums, ...newNums];
