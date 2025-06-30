import { HttpConfig, AuthStrategy } from './config';
import { tokenStorage } from './tokenStorage';

export interface ApiResult<T> {
  status: number;
  message?: string;
  data: T;
  headers: Headers;
}


type NormalisedAuth = {
  strategy: AuthStrategy;
  header: string;                 // always defined
  scheme: string;
  onUnauthorized: () => void;
};

function normaliseConfig(cfg: HttpConfig) {
  const auth: NormalisedAuth = {
    strategy: cfg.auth?.strategy ?? 'none',
    header: cfg.auth?.header ?? 'Authorization',
    scheme: cfg.auth?.scheme ?? 'Bearer ',
    onUnauthorized: cfg.auth?.onUnauthorized ?? (() => tokenStorage.clear()),
  };

  return {
    baseURL: cfg.baseURL,
    timeout: cfg.timeout ?? 0,
    defaultHeaders: cfg.defaultHeaders ?? {},
    auth,
  };
}


export function createHttp(cfg: HttpConfig) {
  const full = normaliseConfig(cfg);

  async function request<B, R>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    body?: B,
    headers: HeadersInit = {},
  ): Promise<ApiResult<R>> {
    const ctrl = full.timeout ? new AbortController() : undefined;
    if (ctrl) setTimeout(() => ctrl.abort(), full.timeout);

    const allHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...full.defaultHeaders,
      ...headers,
    };

    if (full.auth.strategy === 'jwt') {
      const t = tokenStorage.get();
      if (t) (allHeaders as Record<string, string>)[full.auth.header] = full.auth.scheme + t;
    }

    const res = await fetch(full.baseURL + url, {
      method,
      headers: allHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl?.signal,
    });

    if (res.status === 401 && full.auth.strategy === 'jwt') {
      tokenStorage.clear();
      full.auth.onUnauthorized();
    }

    const text = await res.text();
    const parsed = text ? JSON.parse(text) : null;

    if (!res.ok) throw { status: res.status, message: parsed?.message, data: parsed };

    /* Save new token if server rotates it */
    if (full.auth.strategy === 'jwt') {
      const hdrToken = res.headers.get(full.auth.header);
      if (hdrToken) tokenStorage.set(hdrToken.replace(full.auth.scheme, ''));
    }

    return { status: res.status, message: parsed?.message, data: parsed as R, headers: res.headers };
  }

  return {
    get:   <R>(u: string, h?: HeadersInit)           => request<void, R>('GET',    u, undefined, h),
    post:  <B, R>(u: string, b: B, h?: HeadersInit) => request<B,   R>('POST',   u, b,         h),
    put:   <B, R>(u: string, b: B, h?: HeadersInit) => request<B,   R>('PUT',    u, b,         h),
    patch: <B, R>(u: string, b: B, h?: HeadersInit) => request<B,   R>('PATCH',  u, b,         h),
    del:   <R>(u: string, h?: HeadersInit)           => request<void, R>('DELETE', u, undefined, h),
  };
}
