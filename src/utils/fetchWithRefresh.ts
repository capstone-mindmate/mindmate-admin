export function setTokenCookie(token: string, key: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${key}=${token}; path=/; expires=${expires}`
}

export function getTokenCookie(key: string) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(key + '='))
    ?.split('=')[1]
}

declare global {
  interface Window {
    clearUser?: () => void
  }
}

let isSessionExpired = false

export async function fetchWithRefresh(input: RequestInfo, init?: RequestInit) {
  const accessToken = getTokenCookie('accessToken')

  const headers = {
    ...(init?.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }

  if (init?.body instanceof FormData) {
    if ('Content-Type' in headers) {
      delete headers['Content-Type']
    }
  }

  let res = await fetch(input, { ...init, headers, credentials: 'include' })

  if (res.status === 401) {
    const refreshToken = getTokenCookie('refreshToken')
    const refreshRes = await fetch('http://localhost/api/auth/refresh', {
      method: 'POST',
      headers: {
        ...(refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {}),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json()
      if (refreshData.accessToken)
        setTokenCookie(refreshData.accessToken, 'accessToken')
      if (refreshData.refreshToken)
        setTokenCookie(refreshData.refreshToken, 'refreshToken')
      const newAccessToken = getTokenCookie('accessToken')
      const retryHeaders = {
        ...(init?.headers || {}),
        ...(newAccessToken
          ? { Authorization: `Bearer ${newAccessToken}` }
          : {}),
      }
      res = await fetch(input, {
        ...init,
        headers: retryHeaders,
        credentials: 'include',
      })
    } else {
      // 세션 만료 처리: 한 번만 실행
      if (!isSessionExpired) {
        isSessionExpired = true
        setTokenCookie('', 'accessToken', -1)
        setTokenCookie('', 'refreshToken', -1)
        localStorage.removeItem('auth-store')
        if (
          typeof window !== 'undefined' &&
          typeof window.clearUser === 'function'
        ) {
          window.clearUser()
        }


        localStorage.clear()
        window.location.href = '/login'
      }
      throw new Error('토큰 갱신 실패')
    }
  }
  return res
}


// JWT 디코드 함수 (exp 등 payload 추출)
export function decodeJWT(token: string): {
  exp: number
  iat: number
  sub: string
  email: string
  name: string
} | null {
  try {
    const payload = token.split('.')[1]
    // 이전 코드의 Base64URL-safe 디코딩 로직을 다시 추가
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (e: unknown) {
    console.error("Error! : ", e);
    return null
  }
}