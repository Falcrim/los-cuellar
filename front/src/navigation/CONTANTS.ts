export const URLS = {
  HOME: "/home",
  LOGIN: "/login",
  USUARIOS: {
    LIST: "/usuarios",
    CREATE: "/usuarios/create",
    EDIT: "/usuarios/:id",
    UPDATE: (id: number) => `/usuarios/${id}`,
  },
  RECINTOS: {
    LIST: "/recintos",
    CREATE: "/recintos/create",
    EDIT: "/recintos/:id",
    UPDATE: (id: number) => `/recintos/${id}`,
  },
  MESAS: {
    CREATE_PARAM: "/recintos/:recintoId/mesa/create",
    CREATE: (recintoId: number) => `/recintos/${recintoId}/mesa/create`,
    EDIT: "/mesas/:id",
    UPDATE: (id: number) => `/mesas/${id}`,
  },
  SECCIONES: {
    LIST: "/secciones",
    CREATE: "/secciones/create",
    EDIT: "/secciones/:id",
    UPDATE: (id: number) => `/secciones/${id}`,
  },
};
