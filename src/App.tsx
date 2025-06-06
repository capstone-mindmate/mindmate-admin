import { RouterProvider } from 'react-router-dom';
import { router } from "./routes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "./stores/userStore";
import { decodeJWT } from "./utils/fetchWithRefresh";

function App() {

  const queryClient = new QueryClient()
  window.clearUser = useAuthStore.getState().clearUser

  // accessToken 구독
  const accessToken = useAuthStore((state) => state.user?.accessToken)

  useEffect(() => {

    // JWT 만료 자동 로그아웃
    if (accessToken) {
      const payload = decodeJWT(accessToken)
      if (payload && payload.exp) {
        const now = Math.floor(Date.now() / 1000)
        const remain = payload.exp - now
        if (remain > 0) {
          const timer = setTimeout(() => {
            if (typeof window.clearUser === 'function') window.clearUser()
            localStorage.clear()
            window.location.href = '/login'
          }, remain * 1000)
          return () => clearTimeout(timer)
        } else {
          if (typeof window.clearUser === 'function') window.clearUser()
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
  }, [accessToken])


  return (
    <GoogleOAuthProvider clientId="886143898358-4cja76nlu7mp5upid042la3k3vovnd8p.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
