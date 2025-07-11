import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";

type User = {
  email: string;
  role: string;
};

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const doLogin = (params: {
    access_token: string;
    refresh_token: string;
    email?: string;
    role?: string;
  }) => {
    localStorage.setItem("access_token", params.access_token);
    localStorage.setItem("refresh_token", params.refresh_token);
    if (params.email) localStorage.setItem("email", params.email);
    if (params.role) localStorage.setItem("role", params.role);

    if (params.email && params.role) {
      setUser({ email: params.email, role: params.role });
    }

    setIsAuthenticated(true);
  };

  const doLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (accessToken && refreshToken) {
      setIsAuthenticated(true);
      if (email && role) setUser({ email, role });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    doLogin,
    doLogout,
  };
};
