// An error from the backend. The code (for example "database_resting") tells the page what to show.
export class ApiError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

// Calls the backend at the address in config.js and returns the parsed answer, or throws an ApiError.
export async function apiFetch(path, options = {}) {
  const response = await fetch(`${window.CONFIG?.API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new ApiError(data.error || 'Something went wrong. Please try again.', data.code)
  }
  return data
}
