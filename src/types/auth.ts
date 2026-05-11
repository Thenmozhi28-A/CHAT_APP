export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
  roles?: string[];
  avatar?: string;
}

export interface LoginResponse {
  message: string;
  statusCode: number;
  data?: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    user: User; // The user object might be nested or we might need to map it
  };
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}
