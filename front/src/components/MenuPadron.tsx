import { useState } from "react";
import { List, ChevronDown } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { URLS } from "../navigation/CONTANTS";

export const MenuPadron = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, doLogout } = useAuth();

  const toggleMenu = () => setShowMenu(!showMenu);

  const toggleSubMenu = (id: string) => {
    const subMenu = document.getElementById(id);
    const shownSubMenus = document.getElementsByClassName("submenu-shown");
    for (let i = 0; i < shownSubMenus.length; i++) {
      const element = shownSubMenus[i] as HTMLElement;
      if (element.id !== id) {
        element.classList.add("hidden");
        element.classList.remove("submenu-shown");
      }
    }
    if (subMenu) {
      subMenu.classList.toggle("hidden");
      subMenu.classList.toggle("submenu-shown");
    }
  };

  const onLogoutClick = () => {
    doLogout();
    window.location.href = URLS.LOGIN;
  };

  const goTo = (path: string) => {
    navigate(path);
    setShowMenu(false);
    const shownSubMenus = document.getElementsByClassName("submenu-shown");
    for (let i = 0; i < shownSubMenus.length; i++) {
      const element = shownSubMenus[i] as HTMLElement;
      element.classList.add("hidden");
      element.classList.remove("submenu-shown");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <span className="text-xl font-bold text-white">Padrón Electoral</span>
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none cursor-pointer"
            >
              <List />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button
                onClick={() => toggleSubMenu("submenu-votantes")}
                className="text-white hover:text-gray-400 flex items-center focus:outline-none"
              >
                Votantes <ChevronDown size={14} className="ml-1" />
              </button>
              <div
                id="submenu-votantes"
                className="absolute hidden bg-black mt-2 rounded shadow-lg z-10 min-w-[150px]"
              >
                <button
                  onClick={() => goTo(URLS.VOTANTES.LIST)}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                >
                  Ver Votantes
                </button>
                <button
                  onClick={() => goTo(URLS.VOTANTES.CREATE)}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                >
                  Crear Votante
                </button>
              </div>
            </div>

            <button
              onClick={onLogoutClick}
              className="text-white hover:text-red-500"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {showMenu && (
          <div className="md:hidden flex flex-col items-start mt-2 space-y-1 pb-4 border-t border-gray-700">
            <button
              onClick={() => toggleSubMenu("mobile-submenu-votantes")}
              className="flex justify-between items-center w-full px-4 py-2 text-white hover:bg-gray-800 focus:outline-none"
            >
              Votantes
              <ChevronDown
                size={14}
                className={`ml-2 transition-transform duration-200 ${
                  document.getElementById("mobile-submenu-votantes")?.classList.contains("submenu-shown")
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>
            <div
              id="mobile-submenu-votantes"
              className="hidden flex flex-col w-full pl-6"
            >
              <button
                onClick={() => goTo(URLS.VOTANTES.LIST)}
                className="text-white py-1 hover:bg-gray-800 text-left w-full"
              >
                Ver Votantes
              </button>
              <button
                onClick={() => goTo(URLS.VOTANTES.CREATE)}
                className="text-white py-1 hover:bg-gray-800 text-left w-full"
              >
                Crear Votante
              </button>
            </div>

            <button
              onClick={onLogoutClick}
              className="text-white px-4 py-2 hover:text-red-500 w-full text-left"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
