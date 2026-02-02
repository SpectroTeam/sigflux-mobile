import { AuthCredentials, AuthResponse, Paciente, CreatePacienteDto, User, Acompanhante, CreateAcompanhanteDto, CreateUserDto, PacienteStatus } from "../types";
import { PACIENTE_STATUS } from "../constants";

// tempo maximo de delay em milisegundos
const MAX_DELAY_MS = 1000;

// dados mockados porque os responsaveis pelo backend são lerdos demais

let users_key = 3;

const mockedUsers: User[] = [
    {
        id: "1",
        nome_completo: "Erick",
        cpf: "123.456.789-00",
        email: "erick.gg@email.com",
        matricula: "20230001",
        telefone: "(11) 91234-5678",
        cargo: "Analista",
        password: "password123",
    },
    {
        id: "2",
        nome_completo: "Heloisa",
        cpf: "234.567.890-11",
        email: "heloisa.lise@email.com",
        matricula: "20230002",
        telefone: "(21) 92345-6789",
        cargo: "Gerente",
        password: "securepass",
    },
    {
        id: "3",
        nome_completo: "Tatiane",
        cpf: "345.678.901-22",
        email: "tatiane.tt@email.com",
        matricula: "20230003",
        telefone: "(31) 93456-7890",
        cargo: "Coordenadora",
        password: "mypassword",
    },
];

let pacientes_key = 4;

const mockedPacientes: Paciente[] = [
    {
        id: "1",
        nome: "José Fernando Alves",
        cpf: "234.567.890-11",
        rg: "1.234.567-8",
        endereco: "Rua A, 123, Cidade X",
        telefone: "(11) 91234-5678",
        birthDate: new Date(1980, 5, 15).toISOString(),
        status: "inativo",
        documentosAnexados: [
            "https://itaudeminas.mg.gov.br/arquivos/ere/livros/chapeuzinho-vermelho-2.pdf",
            "https://salto.sp.gov.br/download/Os%20Tr%C3%AAs%20Porquinhos.pdf",
            "https://www.fortaleza.ce.gov.br/images/Cultura/Monteiro_Lobato_-_O_Saci.pdf"
        ],
        historicoViagens: [
            {
                id: "v1",
                dataIda: new Date(2023, 0, 10).toISOString(),
                dataVolta: new Date(2023, 0, 20).toISOString(),
                origem: "Cidade X",
                destino: "Cidade Y",
                status: "Concluída",
            },
            {
                id: "v2",
                dataIda: new Date(2023, 2, 5).toISOString(),
                origem: "Cidade Y",
                destino: "Cidade Z",
                status: "Em andamento",
            },
            {
                id: "v3",
                dataIda: new Date(2023, 4, 15).toISOString(),
                dataVolta: new Date(2023, 4, 25).toISOString(),
                origem: "Cidade Z",
                destino: "Cidade X",
                status: "Planejada",
            },
            {
                id: "v4",
                dataIda: new Date(2022, 10, 1).toISOString(),
                dataVolta: new Date(2022, 10, 10).toISOString(),
                origem: "Cidade X",
                destino: "Cidade W",
                status: "Concluída",
            },
            {
                id: "v5",
                dataIda: new Date(2022, 7, 20).toISOString(),
                dataVolta: new Date(2022, 7, 30).toISOString(),
                origem: "Cidade W",
                destino: "Cidade Y",
                status: "Concluída",
            },
        ],
        acompanhantes: [
            {
                id: "a1",
                nome: "Ana Alves",
                cpf: "987.654.321-00",
                telefone: "(11) 99876-5432",
                parentesco: "conjuge",
            },
            {
                id: "a2",
                nome: "Carlos Alves",
                cpf: "876.543.210-99",
                telefone: "(11) 98765-4321",
                parentesco: "filho",
            },
            {
                id: "a3",
                nome: "Mariana Alves",
                cpf: "765.432.109-88",
                telefone: "(11) 97654-3210",
                parentesco: "filho",
            },
            {
                id: "a6",
                nome: "João Alves",
                cpf: "654.321.098-77",
                telefone: "(11) 96543-2109",
                parentesco: "pai",
            }
        ],
    },
    {
        id: "2",
        nome: "Maria Silva Santos",
        cpf: "123.456.789-00",
        rg: "2.345.678-9",
        endereco: "Avenida B, 456, Cidade Y",
        telefone: "(21) 92345-6789",
        birthDate: new Date(1990, 10, 20).toISOString(),
        status: "inativo",
        documentosAnexados: [
            "https://s2.q4cdn.com/175719177/files/doc_presentations/Placeholder-PDF.pdf",
            "https://www.prodepa.pa.gov.br/sites/default/files/2023-08/Placeholder-PDF_10.pdf"
        ],
        historicoViagens: [
            {
                id: "v6",
                dataIda: new Date(2023, 1, 15).toISOString(),
                dataVolta: new Date(2023, 1, 25).toISOString(),
                origem: "Cidade Y",
                destino: "Cidade Z",
                status: "Concluída",
            },
        ],
        acompanhantes: [
            {
                id: "a4",
                nome: "Pedro Santos",
                cpf: "654.321.098-77",
                telefone: "(21) 96543-2109",
                parentesco: "conjuge",
            },
            {
                id: "a5",
                nome: "Lucas Santos",
                cpf: "543.210.987-66",
                telefone: "(21) 95432-1098",
                parentesco: "filho",
            },
        ],
    },
    {
        id: "3",
        nome: "João Pedro Costa",
        cpf: "345.678.901-22",
        rg: "3.456.789-0",
        endereco: "Travessa  C, 789, Cidade Z",
        telefone: "(31) 93456-7890",
        birthDate: new Date(1975, 2, 5).toISOString(),
        status: "inativo",
        historicoViagens: [],
        documentosAnexados: [],
        acompanhantes: [],
    },
];

export async function getUsers(): Promise<User[]> {
    await delay();
    return deepCopy(mockedUsers);
}

export async function getUserById(userId: string): Promise<User> {
    await delay();
    const user = mockedUsers[parseInt(userId) % mockedUsers.length];
    if (!user) {
        throw new Error("User not found");
    }
    return deepCopy(user);
}

export async function insertUser(user: CreateUserDto): Promise<User> {
    await delay();

    const newUser = {
        ...user,
        id: (users_key++).toString(),
    };
    mockedUsers.push(newUser);

    return deepCopy(newUser);
}

export async function deleteUser(userId: string): Promise<void> {
    await delay();
    const index = mockedUsers.findIndex((u) => u.id === userId);
    if (index === -1) {
        throw new Error("User not found");
    }
    mockedUsers.splice(index, 1);
}

export async function updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    await delay();
    const index = mockedUsers.findIndex((u) => u.id === userId);

    if (index === -1) {
        throw new Error("User not found");
    }

    mockedUsers[index] = {
        ...mockedUsers[index],
        ...userData,
    };

    return deepCopy(mockedUsers[index]);
}

export async function findUserByCredentials(credentials: AuthCredentials): Promise<AuthResponse> {
    await delay();
    const { matricula, password } = credentials;
    const user = mockedUsers.find((user) => user.matricula === matricula && user.password === password);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    return {
        user,
        token: "pangare-paraguaio",
    };
}

export async function getPacientes(): Promise<Paciente[]> {
    await delay();
    return deepCopy(mockedPacientes);
}

export async function getPacienteById(pacienteId: string): Promise<Paciente> {
    await delay();
    const paciente = mockedPacientes[parseInt(pacienteId) % mockedPacientes.length];
    if (!paciente) {
        throw new Error("Paciente not found");
    }
    return deepCopy(paciente);
}

export async function insertPaciente(paciente: CreatePacienteDto): Promise<Paciente> {
    await delay();

    const newPaciente = {
        ...paciente,
        id: (pacientes_key++).toString()
    };
    mockedPacientes.push(newPaciente);

    return deepCopy(newPaciente);
}

export async function deletePaciente(pacienteId: string): Promise<void> {
    await delay();
    const index = mockedPacientes.findIndex((p) => p.id === pacienteId);
    if (index === -1) {
        throw new Error("Paciente not found");
    }
    mockedPacientes.splice(index, 1);
}

export async function updatePaciente(pacienteId: string, pacienteData: CreatePacienteDto): Promise<Paciente> {
    await delay();
    const index = mockedPacientes.findIndex((p) => p.id === pacienteId);

    if (index === -1) {
        throw new Error("Paciente not found");
    }

    mockedPacientes[index] = {
        ...mockedPacientes[index],
        ...pacienteData,
    };

    return deepCopy(mockedPacientes[index]);
}

export function updatePacienteStatus(pacienteId: string, status: PacienteStatus): Paciente {
    const index = mockedPacientes.findIndex((p) => p.id === pacienteId);
    if (index === -1) {
        throw new Error("Paciente not found");
    }
    mockedPacientes[index].status = status;
    return deepCopy(mockedPacientes[index]);
}

export function getPacienteByIdSync(pacienteId: string): Paciente | undefined {
    return mockedPacientes.find((p) => p.id === pacienteId);
}

export async function addAcompanhante(
    pacienteId: string,
    acompanhante: CreateAcompanhanteDto,
): Promise<Acompanhante> {
    await delay();
    const paciente = mockedPacientes.find((p) => p.id === pacienteId);
    if (!paciente) {
        throw new Error("Paciente not found");
    }

    const newAcompanhante: Acompanhante = {
        ...acompanhante,
        id: `a${Math.floor(Math.random() * 10000)}`,
    };

    if (!paciente.acompanhantes) {
        paciente.acompanhantes = [];
    }

    paciente.acompanhantes.push(newAcompanhante);

    return deepCopy(newAcompanhante);
}

export async function deleteAcompanhante(pacienteId: string, acompanhanteId: string): Promise<void> {
    await delay();
    const paciente = mockedPacientes.find((p) => p.id === pacienteId);
    if (!paciente || !paciente.acompanhantes) {
        throw new Error("Paciente or acompanhante not found");
    }

    const index = paciente.acompanhantes.findIndex((a) => a.id === acompanhanteId);
    if (index === -1) {
        throw new Error("Acompanhante not found");
    }

    paciente.acompanhantes.splice(index, 1);
}

export async function updateAcompanhante(
    pacienteId: string,
    acompanhanteId: string,
    acompanhanteData: CreateAcompanhanteDto,
): Promise<Acompanhante> {
    await delay();
    const paciente = mockedPacientes.find((p) => p.id === pacienteId);
    if (!paciente || !paciente.acompanhantes) {
        throw new Error("Paciente or acompanhante not found");
    }

    const index = paciente.acompanhantes.findIndex((a) => a.id === acompanhanteId);
    if (index === -1) {
        throw new Error("Acompanhante not found");
    }

    const updatedAcompanhante: Acompanhante = {
        ...paciente.acompanhantes[index],
        ...acompanhanteData,
    };

    paciente.acompanhantes[index] = updatedAcompanhante;

    return deepCopy(updatedAcompanhante);
}

async function delay(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * MAX_DELAY_MS) + 1;
    return new Promise((resolve) => setTimeout(resolve, randomNumber));
}

function deepCopy<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}
