export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const nextInit: RequestInit = {
    ...init,
    credentials: init?.credentials || 'include',
  };

  try {
    const token = localStorage.getItem('nutriplan_auth_token');
    if (token) {
      const headers = new Headers(init?.headers || {});
      if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      nextInit.headers = headers;
    }
  } catch {
    // ignore storage errors
  }

  return window.fetch(input, nextInit);
}
