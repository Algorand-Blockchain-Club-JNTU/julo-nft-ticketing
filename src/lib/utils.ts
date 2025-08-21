import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
   console.log("cn function called with inputs:", inputs)
   return twMerge(clsx(inputs))
}
