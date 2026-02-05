export const STORAGE_KEYS = {
    AUTH_TOKEN: "@sigflux:auth_token",
    USER_DATA: "@sigflux:user_data",
};

export const REACT_QUERY_DEFAULTS = {
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
};

export const REACT_QUERY_KEYS = {
    PACIENTES: "pacientes",
    MOTORISTAS: "motoristas",
    VEICULOS: "veiculos",
    USUARIO: "usuario",
    VIAGEM: "viagens",
    CASA_APOIO: "casa_apoio"
};

export const PACIENTE_STATUS = {
    INATIVO: "inativo",
    EM_VIAGEM: "em viagem",
    HOSPEDADO: "hospedado",
} as const;

export const PACIENTE_STATUS_OPTIONS = [
    { label: "Inativo", value: PACIENTE_STATUS.INATIVO },
    { label: "Em viagem", value: PACIENTE_STATUS.EM_VIAGEM },
    { label: "Hospedado", value: PACIENTE_STATUS.HOSPEDADO },
] as const;

export const VEICULOS_STATUS = {
    INATIVO: "Inativo",
    EM_VIAGEM: "Em viagem",
} as const;

export const VEICULOS_STATUS_OPTIONS = [
    { label: "Inativo", value: VEICULOS_STATUS.INATIVO },
    { label: "Em viagem", value: VEICULOS_STATUS.EM_VIAGEM },
] as const;

export const VIAGEM_STATUS = {
    PLANEJADA: "Planejada",
    EM_ANDAMENTO: "Em andamento",
    CONCLUIDA: "Concluída",
    CANCELADA: "Cancelada",
} as const;

export const VIAGEM_STATUS_OPTIONS = [
    { label: "Planejada", value: VIAGEM_STATUS.PLANEJADA },
    { label: "Em viagem", value: VIAGEM_STATUS.EM_ANDAMENTO },
    { label: "Concluída", value: VIAGEM_STATUS.CONCLUIDA },
    { label: "Cancelada", value: VIAGEM_STATUS.CANCELADA },
] as const;


export const SNACKBAR_DURATION = {
    short: 500,
    default: 1500,
    long: 2500,
    max: 3000,
} as const;
