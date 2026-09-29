export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
export const TIMEOUT_MS = 10000;

export class ApiError extends Error {
  constructor(kind, status) {
    super(kind);
    this.kind = kind;
    this.status = status;
  }
}

export async function request(path, {method = 'GET', body, timeout = TIMEOUT_MS, fetch = globalThis.fetch} = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const json = body !== undefined && !(body instanceof FormData);
  try {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}${path}`, {method, body: json ? JSON.stringify(body) : body, headers: json ? {'Content-Type': 'application/json'} : undefined, signal: controller.signal});
    } catch (error) {
      throw new ApiError(error.name === 'AbortError' ? 'timeout' : 'network');
    }
    if (!response.ok) throw new ApiError('http', response.status);
    try {
      const aborted = new Promise((_, reject) => controller.signal.addEventListener('abort', () => reject(new ApiError('timeout'))));
      return await Promise.race([response.json(), aborted]);
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(error.name === 'AbortError' ? 'timeout' : 'malformed');
    }
  } finally {
    clearTimeout(timer);
  }
}

export const fetcher = path => request(path);
export const poster = (path, body, options) => request(path, {...options, method: 'POST', body});
export const downloadBrochure = email => poster('/brochure-request', {email});
