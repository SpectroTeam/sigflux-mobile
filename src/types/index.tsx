import { PACIENTE_STATUS, VEICULOS_STATUS, SNACKBAR_DURATION } from "../constants";

export type User = {
    id: string;
    nome_completo: string;
    cpf: string;
    email: string;
    matricula: string;
    telefone: string;
    cargo: string;
    password: string;
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

export type CreateUserDto = Omit<User, "id">;
export type UpdateUserDto = CreateUserDto;

export type PacienteStatus = typeof PACIENTE_STATUS[keyof typeof PACIENTE_STATUS];

export type VeiculoStatus = typeof VEICULOS_STATUS[keyof typeof VEICULOS_STATUS];

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

export type Motorista = {
    id: string;
    nome: string;
    telefone: string;
    matricula: string;
    documentosAnexados?: string[];
};

export type CreateMotoristaDto = Omit<Motorista, "id">;
export type UpdateMotoristaDto = CreateMotoristaDto;

export type Veiculo = {
    id: string;
    placa: string;
    chassi: string;
    modelo: string; 
    ano: number;
    cor: string;
    capacidade: number;
    status: VeiculoStatus;
    documentosAnexados?: string[];
};

export type CreateVeiculoDto = Omit<Veiculo, "id">;
export type UpdateVeiculoDto = CreateVeiculoDto;

export type VeiculoStackParamList = {
    ListVeiculos: undefined;
    EditCreateVeiculo: { veiculoId?: string } | undefined;
    VeiculoDetails: { veiculoId: string };
    VeiculoDocumentosAnexados: { veiculoId: string };
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
    EditCreatePaciente: { pacienteId?: string } | undefined;
    PacienteDetails: { pacienteId: string };
    PacienteHistoricoViagens: { pacienteId: string };
    PacienteDocumentosAnexados: { pacienteId: string };
    ListAcompanhantes: { pacienteId: string };
    EditCreateAcompanhante: { pacienteId: string; acompanhanteId?: string };
};

export type CasaApoioStackParamList = {
    ListCasasApoio: undefined;
    EditCreateCasaApoio: { casaApoioId?: string } | undefined;
};

export type MotoristaStackParamList = {
    ListMotoristas: undefined;
    EditCreateMotorista: { motoristaId?: string } | undefined;
    MotoristaDetails: { motoristaId: string };
    MotoristaDocumentosAnexados: { motoristaId: string };
};

export type UserStackParamList = {
    ListGestores: undefined;
    EditCreateGestor: { gestorId?: string } | undefined;
    GestorDetails: { gestorId: string };
};

export type AuthStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
};

export type MainStackParamList = {
    Home: undefined;
    PacienteStack: undefined;
    CasaApoioStack: undefined;
    MotoristaStack: undefined;
    VeiculoStack: undefined;
    GestorStack: undefined;
};

// navigation types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type SnackbarDurationKey = keyof typeof SNACKBAR_DURATION;
