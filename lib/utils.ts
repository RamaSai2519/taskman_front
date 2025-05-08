import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';


export const axiosInstance = axios.create({
  // baseURL: 'https://ugqy0d76e4.execute-api.us-east-1.amazonaws.com/main/api',
  baseURL: 'http://localhost:5000/api',
});


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
