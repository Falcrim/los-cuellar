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
  ELECCIONES: {
    LIST: "/elecciones",
    CREATE: "/elecciones/create",
    EDIT: "/elecciones/:id",
    UPDATE: (id: number) => `/elecciones/${id}`,
  },
  CARGOS: {
  LIST: "/cargos",
  CREATE: "/cargos/create",
  EDIT: "/cargos/:id",
  UPDATE: (id: number) => `/cargos/${id}`
  },
    CANDIDATURAS: {
    LIST: "/candidaturas",
    CREATE: "/candidaturas/create",
    EDIT: "/candidaturas/:id",
    UPDATE: (id: number) => `/candidaturas/${id}`,
  },
  VOTANTES: {
    LIST: "/votantes",
    CREATE: "/votantes/create",
    EDIT: "/votantes/:id",
    UPDATE: (id: number) => `/votantes/${id}`,
  },
};
