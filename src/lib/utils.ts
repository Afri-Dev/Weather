import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// import { weatherApi } from "../lib/api/weatherApi";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}