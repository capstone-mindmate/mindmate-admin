import { useAuthStore } from "../stores/userStore";
import { useEffect } from "react";
import { useNavigate, Navigate, createBrowserRouter } from "react-router-dom";

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
    element: <Users />,
  },
  {
    path: "/report",
    element: <Report />,
  },
  {
    path: "/emoticons",
    element: <Emoticons />,
  },
  {
    path: "/emoticons_list",
    element: <EmoticonsList />,
  },
  {
    path: "/magazine",
    element: <Magazine />,
  },
  {
    path: "/toastbox",
    element: <Toastbox />,
  },
  {
    path: "/payments",
    element: <Payments />,
  },
  {
    path: "/filter",
    element: <Filter />,
  },
  {
    path: "/review",
    element: <Review />,
  },
  {
    path: "/notification",
    element: <Notification />,
  },
]);