import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setTokenCookie } from '../../utils/fetchWithRefresh'
import { useAuthStore } from '../../stores/userStore'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  role: string
}

const Auth = () => {
  const navigate = useNavigate()
  const { setUser, setUserEmail } = useAuthStore()

  useEffect(() => {
    const fetchProfile = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const refreshToken = urlParams.get('refreshToken')
      const userEmail = urlParams.get('email')

      if (token && refreshToken) {
        setTokenCookie(token, 'accessToken')
        setTokenCookie(refreshToken, 'refreshToken')

        const decodedToken = jwtDecode(token)
        const userRole = (decodedToken as JwtPayload).role
        if (userRole !== 'ROLE_ADMIN') {
          navigate('/login')
          return
        }

        try {
          const res = await fetchWithRefresh(`${import.meta.env.VITE_API_SERVER_URL}/profiles`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error)
          }
          const profileData = await res.json()
          setUser(profileData)
          if (userEmail) {
            setUserEmail(userEmail)
          }
          navigate('/home')
        } catch (e) {
          if (e instanceof Error) {
            navigate('/login')
          }
        }
      } else {
        navigate('/login')
      }
    }
    fetchProfile()
  }, [navigate, setUser])

  return (
    <div className="loading-container">
      <p>로그인 중...</p>
    </div>
  )
}

export default Auth
