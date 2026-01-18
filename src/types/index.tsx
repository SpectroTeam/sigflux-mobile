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
export type UpdateAcompanhanteDto = CreateAcompanhanteDto;

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

export type CasaApoio = {
    id: string;
    nome: string;
    endereco: string;
    capacidadeMaxima: number;
    lotacaoAtual: number;
};

export type CreateCasaApoioDto = Omit<CasaApoio, "id">;
export type UpdateCasaApoioDto = CreateCasaApoioDto;

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
    EditCreatePaciente: { pacienteId?: string } | undefined;
    PacienteDetails: { pacienteId: string };
    PacienteHistoricoViagens: { pacienteId: string };
    PacienteDocumentosAnexados: { pacienteId: string };
    ListAcompanhantes: { pacienteId: string };
    EditCreateAcompanhante: { pacienteId: string; acompanhanteId?: string };
};

export type CasaApoioStackParamList = {
    ListCasasApoio: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
};

export type MainStackParamList = {
    Home: undefined;
    PacienteStack: undefined;
    CasaApoioStack: undefined;
};

// navigation types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type SnackbarDurationKey = keyof typeof SNACKBAR_DURATION;
