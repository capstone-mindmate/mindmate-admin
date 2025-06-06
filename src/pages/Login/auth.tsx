import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setTokenCookie } from '../../utils/fetchWithRefresh'
import { useAuthStore } from '../../stores/userStore'
import { fetchWithRefresh } from '../../utils/fetchWithRefresh'

const Auth = () => {
  const navigate = useNavigate()
  const { setUser, setUserEmail } = useAuthStore()

  const exceptEmail = ["ajoumindmate@gmail.com", "nowijnah@ajou.ac.kr", "a856412@gmail.com", "joedaehui@ajou.ac.kr", "skfnxhjjj@ajou.ac.kr"]

  useEffect(() => {
    const fetchProfile = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const refreshToken = urlParams.get('refreshToken')
      const userEmail = urlParams.get('email')

      if (token && refreshToken) {
        setTokenCookie(token, 'accessToken')
        setTokenCookie(refreshToken, 'refreshToken')

        try {
          const res = await fetchWithRefresh(`${import.meta.env.VITE_API_LOCAL_URL}/profiles`, {
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


          if(exceptEmail.includes(userEmail || '')) {
            navigate('/home')
          } else {
            navigate('/login')
          }
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
