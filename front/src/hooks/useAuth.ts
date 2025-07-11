import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const doLogin = (params: { access_token: string; refresh_token: string; email?: string }) => {
    localStorage.setItem("access_token", params.access_token);
    localStorage.setItem("refresh_token", params.refresh_token);
    if (params.email) {
      localStorage.setItem("email", params.email);
      setEmail(params.email);
    }
    setIsAuthenticated(true);
  };

  const doLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
    setEmail(null);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const storedEmail = localStorage.getItem("email");

    if (accessToken && refreshToken) {
      setIsAuthenticated(true);
      if (storedEmail) setEmail(storedEmail);
    } else {
      setIsAuthenticated(false);
      setEmail(null);
    }
  }, [dispatch]);

  return {
    isAuthenticated,
    email,
    doLogin,
    doLogout,
  };
};
