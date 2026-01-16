import { PACIENTE_STATUS, SNACKBAR_DURATION } from "../constants";

export type User = {
    nome_completo: string;
    cpf: string;
    email: string;
    matricula: string;
    telefone: string;
    cargo: string;
};

export type ViagemPaciente = {
    id: string;
    dataIda: string;
    dataVolta?: string;
    origem: string;
    destino: string;
    isPresente?: boolean;
    status: "planejada" | "em andamento" | "concluída" | "cancelada";
};

export type Acompanhante = {
    id: string;
    nome: string;
    cpf: string;
    telefone: string;
    parentesco: string;
};

export type CreateAcompanhanteDto = Omit<Acompanhante, "id">;

export type PacienteStatus = typeof PACIENTE_STATUS[keyof typeof PACIENTE_STATUS];

export type Paciente = {
    id: string;
    nome: string;
    cpf: string;
    rg: string;
    endereco: string;
    telefone: string;
    birthDate: string;
    status: PacienteStatus;
    historicoViagens?: ViagemPaciente[];
    documentosAnexados?: string[];
    acompanhantes?: Acompanhante[];
};

export type CreatePacienteDto = Omit<Paciente, "id" | "historicoViagens" | "documentosAnexados">;
export type UpdatePacienteDto = CreatePacienteDto;

export type PacienteForm = Omit<CreatePacienteDto, "birthDate"> & {
    birthDate: Date;
};

export type AuthCredentials = {
    matricula: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    user: User;
};

export type PacienteStackParamList = {
    ListPacientes: undefined;
    EditCreatePaciente: { pacienteIndex?: number } | undefined;
    PacienteDetails: { pacienteIndex: number };
    PacienteHistoricoViagens: { pacienteIndex: number };
    PacienteDocumentosAnexados: { pacienteIndex: number };
    ListAcompanhantes: { pacienteIndex: number };
    EditCreateAcompanhante: { pacienteIndex: number; acompanhanteIndex?: number };
};

export type AuthStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
};

export type MainStackParamList = {
    Home: undefined;
    PacienteStack: undefined;
};

// navigation types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type SnackbarDurationKey = keyof typeof SNACKBAR_DURATION;
