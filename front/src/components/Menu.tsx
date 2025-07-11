import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { URLS } from "../navigation/CONTANTS";
import { List } from "react-bootstrap-icons";

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, doLogout } = useAuth();

  const toggleMenu = () => setShowMenu(!showMenu);

  const onLogoutClick = () => {
    doLogout();
    window.location.href = URLS.LOGIN;
  };

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">MiLogo</span>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none cursor-pointer"
            >
              <List />
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && (
              <button
                onClick={onLogoutClick}
                className="text-white hover:text-red-500"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
