export interface ErrorResponseInterface {
    error: boolean;
    httpStatus: string;
    code: number;
    message: string;
    details?: any; 
  }