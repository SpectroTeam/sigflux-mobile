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
    dataIda: Date;
    dataVolta?: Date;
    origem: string;
    destino: string;
    isPresente?: boolean;
    status: "planejada" | "em andamento" | "concluída" | "cancelada";
};

export type Paciente = {
    id: string;
    nome: string;
    cpf: string;
    rg: string;
    endereco: string;
    telefone: string;
    birthDate: Date;
    status: string;
    historicoViagens?: ViagemPaciente[];
}

export type RegisterPaciente = Omit<Paciente, 'id'>;

export type AuthCredentials = {
    matricula: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    user: User;
}

export type PacienteStackParamList = {
    ListPacientes: undefined;
    EditCreatePaciente: { pacienteId?: string } | undefined;
    PacienteDetails: { pacienteId: string };
    PacienteHistoricoViagens: { paciente: Paciente };
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
