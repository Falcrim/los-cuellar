import { useState, useEffect } from "react";
import { List, ChevronDown } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { URLS } from "../navigation/CONTANTS";

export const MenuElectoral = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [role, setRole] = useState<string | null>(null);
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.role);
    }
  }, []);

  const isAdminElectoral = role === "AdminElectoral";

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <span className="text-xl font-bold text-white">Admin Electoral</span>
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none cursor-pointer"
            >
              <List />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && isAdminElectoral && (
              <>
                <div className="relative group">
                  <button
                    onClick={() => toggleSubMenu("submenu-seccion")}
                    className="text-white hover:text-gray-400 flex items-center focus:outline-none"
                  >
                    Sección <ChevronDown size={14} className="ml-1" />
                  </button>
                  <div
                    id="submenu-seccion"
                    className="absolute hidden bg-black mt-2 rounded shadow-lg z-10 min-w-[150px]"
                  >
                    <button
                      onClick={() => goTo(URLS.SECCIONES.LIST)}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                    >
                      Ver Secciones
                    </button>
                    <button
                      onClick={() => goTo(URLS.SECCIONES.CREATE)}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                    >
                      Crear Sección
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <button
                    onClick={() => toggleSubMenu("submenu-recintos")}
                    className="text-white hover:text-gray-400 flex items-center focus:outline-none"
                  >
                    Recintos <ChevronDown size={14} className="ml-1" />
                  </button>
                  <div
                    id="submenu-recintos"
                    className="absolute hidden bg-black mt-2 rounded shadow-lg z-10 min-w-[150px]"
                  >
                    <button
                      onClick={() => goTo(URLS.RECINTOS.LIST)}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                    >
                      Ver Recintos
                    </button>
                    <button
                      onClick={() => goTo(URLS.RECINTOS.CREATE)}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                    >
                      Crear Recinto
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <button
                    onClick={() => toggleSubMenu("submenu-elecciones")}
                    className="text-white hover:text-gray-400 flex items-center focus:outline-none"
                  >
                    Elecciones <ChevronDown size={14} className="ml-1" />
                  </button>
                  <div
                    id="submenu-elecciones"
                    className="absolute hidden bg-black mt-2 rounded shadow-lg z-10 min-w-[150px]"
                  >
                    <button
                      onClick={() => goTo(URLS.ELECCIONES.LIST)}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                    >
                      Ver Elecciones
                    </button>
                    <button
                      onClick={() => goTo(URLS.ELECCIONES.CREATE)}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                    >
                      Crear Eleccion
                    </button>
                  </div>
                </div>
              </>
            )}

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

        {showMenu && isAuthenticated && isAdminElectoral && (
          <div className="md:hidden flex flex-col items-start mt-2 space-y-1 pb-4 border-t border-gray-700">
            <button
              onClick={() => toggleSubMenu("mobile-submenu-seccion")}
              className="flex justify-between items-center w-full px-4 py-2 text-white hover:bg-gray-800 focus:outline-none"
            >
              Sección
              <ChevronDown
                size={14}
                className={`ml-2 transition-transform duration-200 ${
                  document.getElementById("mobile-submenu-seccion")?.classList.contains("submenu-shown")
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>
            <div
              id="mobile-submenu-seccion"
              className="hidden flex flex-col w-full pl-6"
            >
              <button
                onClick={() => goTo(URLS.SECCIONES.LIST)}
                className="text-white py-1 hover:bg-gray-800 text-left w-full"
              >
                Ver Secciones
              </button>
              <button
                onClick={() => goTo(URLS.SECCIONES.CREATE)}
                className="text-white py-1 hover:bg-gray-800 text-left w-full"
              >
                Crear Sección
              </button>
            </div>

            <button
              onClick={() => toggleSubMenu("mobile-submenu-recintos")}
              className="flex justify-between items-center w-full px-4 py-2 text-white hover:bg-gray-800 focus:outline-none"
            >
              Recintos
              <ChevronDown
                size={14}
                className={`ml-2 transition-transform duration-200 ${
                  document.getElementById("mobile-submenu-recintos")?.classList.contains("submenu-shown")
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>
            <div
              id="mobile-submenu-recintos"
              className="hidden flex flex-col w-full pl-6"
            >
              <button
                onClick={() => goTo(URLS.RECINTOS.LIST)}
                className="text-white py-1 hover:bg-gray-800 text-left w-full"
              >
                Ver Recintos
              </button>
              <button
                onClick={() => goTo(URLS.RECINTOS.CREATE)}
                className="text-white py-1 hover:bg-gray-800 text-left w-full"
              >
                Crear Recinto
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
