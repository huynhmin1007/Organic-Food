export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  meta: Metadata;
}

export interface Metadata {
  timestamp: string;
  traceId: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
