export type AuthStrategy = 'none' | 'jwt';

export interface HttpConfig {
  baseURL: string;
  timeout?: number;
  auth?: {
    strategy: AuthStrategy;
    header?: string;
    scheme?: string;
    onUnauthorized?: () => void;
  };
  defaultHeaders?: HeadersInit;
}
