//gets queries to the backend api
export const serverQuery = async ({ path }) => {
  let res;

  try {
    res = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  } catch {
    throw new Error('Network error. Failed to connect to server');
  }

  let result = null;
  try {
    result = await res.json();
  } catch {}

  if (!res.ok) {
    switch (res.status) {
      case 401:
        throw new Error(result?.message || 'Unauthorized');
      case 403:
        throw new Error(result?.message || 'Forbidden');
      case 404:
        throw new Error(result?.message || 'Not found');
      default:
        throw new Error(
          result?.message || `Request failed with status ${res.status}`
        );
    }
  }

  return result;
};
