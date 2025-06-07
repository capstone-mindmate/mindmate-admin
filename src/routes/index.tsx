import { useAuthStore } from "../stores/userStore";
import { useEffect } from "react";
import { useNavigate, Navigate, createBrowserRouter } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Auth from "../pages/Login/auth";
import Users from "../pages/Users/Users";
import Report from "../pages/Reports/Report";
import Emoticons from "../pages/Emoticons/Emoticons";
import EmoticonsList from "../pages/Emoticons/EmoticonsList"
import Magazine from "../pages/Magazine/Magazine";
import Payments from "../pages/Payments/Payments";  
import Toastbox from "../pages/Toastbox/Toastbox";
import Filter from "../pages/Filter/Filter";
import Review from "../pages/Review/Review";
import Notification from "../pages/Notification/Notification";

import { fetchWithRefresh } from "../utils/fetchWithRefresh";

interface JwtPayload {
  role: string
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, hydrated, setUser } = useAuthStore();
  const navigate = useNavigate();

  // hydration 후 user가 null이고 localStorage에 user가 있으면 복원 시도 (임시)
  useEffect(() => {
    const fetchProfile = async () => {
      if (hydrated && !user) {
        const raw = localStorage.getItem("auth-store");
        if (raw) {
          try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
              navigate('/login')
              return
            }
            const decodedToken = jwtDecode(token);
            const userRole = (decodedToken as JwtPayload).role
            if (userRole !== 'ROLE_ADMIN') {
              navigate('/login')
              return
            } 
            const profileRes = await fetchWithRefresh(`${import.meta.env.VITE_API_URL}/profile`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if(profileRes.ok) {
              const profileData = await profileRes.json();
              setUser(profileData);
            } else {
              navigate("/login", { replace: true });
              localStorage.removeItem("auth-store");
            }
          } catch (e: unknown) {
            console.error("Error! : ", e);
            navigate("/login", { replace: true });
            localStorage.removeItem("auth-store");
          }
        } else {
          navigate("/login", { replace: true });
        }
      }
    };

    fetchProfile()
  }, [hydrated, user, navigate, setUser]);

  if (!hydrated) {
    return null;
  }

  // 인증 확인
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },
  {
    path: "/home",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/users",
    element: (
      <RequireAuth>
        <Users />
      </RequireAuth>
    ),
  },
  {
    path: "/report",
    element: (
      <RequireAuth>
        <Report />
      </RequireAuth>
    ),
  },
  {
    path: "/emoticons",
    element: (
      <RequireAuth>
        <Emoticons />
      </RequireAuth>
    ),
  },
  {
    path: "/emoticons_list",
    element: (
      <RequireAuth>
        <EmoticonsList />
      </RequireAuth>
    ),
  },
  {
    path: "/magazine",
    element: (
      <RequireAuth>
        <Magazine />
      </RequireAuth>
    ),
  },
  {
    path: "/toastbox",
    element: (
      <RequireAuth>
        <Toastbox />
      </RequireAuth>
    ),
  },
  {
    path: "/payments",
    element: (
      <RequireAuth>
        <Payments />
      </RequireAuth>
    ),
  },
  {
    path: "/filter",
    element: (
      <RequireAuth>
        <Filter />
      </RequireAuth>
    ),
  },
  {
    path: "/review",
    element: (
      <RequireAuth>
        <Review />
      </RequireAuth>
    ),
  },
  {
    path: "/notification",
    element: (
      <RequireAuth>
        <Notification />
      </RequireAuth>
    ),
  },
]);