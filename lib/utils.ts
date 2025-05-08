import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

// Create an Axios instance
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
