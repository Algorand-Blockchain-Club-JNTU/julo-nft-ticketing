import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
   console.log("cn utility function executed")
   return twMerge(clsx(inputs))
}
