const DEFAULT_BACKEND_PORT = '43451'
const env = (import.meta as ImportMeta & {
  env: Record<string, string | boolean | undefined>
}).env

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function getBackendOrigin() {
  const explicitUrl = env.VITE_BACKEND_URL
  if (typeof explicitUrl === 'string' && explicitUrl) return trimTrailingSlash(explicitUrl)

  if (env.DEV) {
    const port = env.VITE_BACKEND_PORT || DEFAULT_BACKEND_PORT
    return `${window.location.protocol}//${window.location.hostname}:${port}`
  }

  return ''
}

export function backendUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const origin = getBackendOrigin()
  return origin ? `${origin}${normalizedPath}` : normalizedPath
}

export function backendFetch(path: string, init?: RequestInit) {
  return fetch(backendUrl(path), init)
}

export function backendEventSource(path: string) {
  return new EventSource(backendUrl(path))
}

export async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  const contentType = response.headers.get('content-type') || ''
  const looksLikeHtml = text.trimStart().startsWith('<')

  if (!response.ok) {
    if (contentType.includes('application/json') && text) {
      const payload = JSON.parse(text) as { error?: string }
      throw new Error(payload.error || `HTTP ${response.status}`)
    }

    if (looksLikeHtml) {
      throw new Error(`Expected JSON from ${response.url}, got HTML instead.`)
    }

    throw new Error(`HTTP ${response.status}`)
  }

  if (!text) return null as T

  if (contentType.includes('application/json')) {
    return JSON.parse(text) as T
  }

  if (looksLikeHtml) {
    throw new Error(`Expected JSON from ${response.url}, got HTML instead.`)
  }

  return JSON.parse(text) as T
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await backendFetch(path, init)
  return readJsonResponse<T>(response)
}
