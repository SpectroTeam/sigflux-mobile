import { PacienteStatus } from "../types";

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
