export interface Metadata {
  timestamp: string;
  traceId: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  meta: Metadata;
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
