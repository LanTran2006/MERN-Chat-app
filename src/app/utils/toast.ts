
import { toast } from 'react-hot-toast';

type ToastMessage = string | Error | unknown;

export const showToast = {
  success: (message: string) => {

    toast.success(message);
  },
  error: (err: ToastMessage) => {
    if ( typeof window == 'undefined') return
    const errorMessage = err instanceof Error 
      ? err.message 
      : typeof err === 'string'
        ? err
        : 'Something went wrong';
    
    toast.error(errorMessage);
  }
};
// Custom error class
export class httpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}

export function normalizePath(s: string) {
  return s.startsWith("/") ? s : "/" + s;
}
export const groupImg='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYvkPOviCcvkT-ZxniCrj12WcWvgHTfbv9cA&s'