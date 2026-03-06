export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    role: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}