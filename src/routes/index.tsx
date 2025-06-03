import { useAuthStore } from '../stores/userStore'
import { useEffect, useState } from 'react'
import {
  useNavigate,
  Navigate,
  createBrowserRouter,
} from 'react-router-dom'


function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, hydrated, setUser } = useAuthStore()
  const navigate = useNavigate()


  // hydration 후 user가 null이고 localStorage에 user가 있으면 복원 시도 (임시)
  useEffect(() => {
    if (hydrated && !user) {
      const raw = localStorage.getItem('auth-store')
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (parsed.state?.user) {
            setUser(parsed.state.user)
          } else {
            navigate('/admin/login', { replace: true })
          }
        } catch (e) {
          console.error('Error restoring user from storage:', e)
          navigate('/admin/login', { replace: true })
        }
      } else {
        navigate('/admin/login', { replace: true })
      }
    }
  }, [hydrated, user, navigate, setUser])

  if (!hydrated) {
    return null
  }

  // 인증 확인
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}   


export const router = createBrowserRouter([
    {
      path: '/',
      element: <RequireAuth><홈화면으로 떨구기 /></RequireAuth>,
    },
  ])
  