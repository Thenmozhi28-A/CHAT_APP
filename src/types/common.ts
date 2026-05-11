export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}
