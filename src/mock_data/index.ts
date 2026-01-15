import { AuthCredentials, AuthResponse, Paciente, RegisterPaciente, User } from "../types";

// tempo maximo de delay em milisegundos
const MAX_DELAY_MS = 1000;

// dados mockados porque os responsaveis pelo backend são lerdos demais

type UserWithPassword = User & { password: string };

const mockedUsers: UserWithPassword[] = [
    {
        nome_completo: "Erick",
        cpf: "123.456.789-00",
        email: "erick.gg@email.com",
        matricula: "20230001",
        telefone: "(11) 91234-5678",
        cargo: "Analista",
        password: "password123",
    },
    {
        nome_completo: "Heloisa",
        cpf: "234.567.890-11",
        email: "heloisa.lise@email.com",
        matricula: "20230002",
        telefone: "(21) 92345-6789",
        cargo: "Gerente",
        password: "securepass",
    },
    {
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
        birthDate: new Date(1980, 5, 15),
        status: "inativo",
        historicoViagens: [
            {
                id: "v1",
                dataIda: new Date(2023, 0, 10),
                dataVolta: new Date(2023, 0, 20),
                origem: "Cidade X",
                destino: "Cidade Y",
                status: "concluída",
            },
            {
                id: "v2",
                dataIda: new Date(2023, 2, 5),
                origem: "Cidade Y",
                destino: "Cidade Z",
                status: "em andamento",
            },
            {
                id: "v3",
                dataIda: new Date(2023, 4, 15),
                dataVolta: new Date(2023, 4, 25),
                origem: "Cidade Z",
                destino: "Cidade X",
                status: "planejada",
            },
            {
                id: "v4",
                dataIda: new Date(2022, 10, 1),
                dataVolta: new Date(2022, 10, 10),
                origem: "Cidade X",
                destino: "Cidade W",
                status: "concluída",
            },
            {
                id: "v5",
                dataIda: new Date(2022, 7, 20),
                dataVolta: new Date(2022, 7, 30),
                origem: "Cidade W",
                destino: "Cidade Y",
                status: "concluída",
            },
        ],
    },
    {
        id: "2",
        nome: "Maria Silva Santos",
        cpf: "123.456.789-00",
        rg: "2.345.678-9",
        endereco: "Avenida B, 456, Cidade Y",
        telefone: "(21) 92345-6789",
        birthDate: new Date(1990, 10, 20),
        status: "inativo",
        historicoViagens: [
            {
                id: "v6",
                dataIda: new Date(2023, 1, 15),
                dataVolta: new Date(2023, 1, 25),
                origem: "Cidade Y",
                destino: "Cidade Z",
                status: "concluída",
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
        birthDate: new Date(1975, 2, 5),
        status: "inativo",
        historicoViagens: [],
    },
];

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
    return mockedPacientes;
}

export async function getPacienteById(pacienteId: string): Promise<Paciente> {
    await delay();
    const paciente = mockedPacientes[parseInt(pacienteId) % mockedPacientes.length];
    if (!paciente) {
        throw new Error("Paciente not found");
    }
    return paciente;
}

export async function insertPaciente(paciente: RegisterPaciente): Promise<Paciente> {
    await delay();

    const newPaciente = {
        ...paciente,
        id: (pacientes_key++).toString(),
    };
    mockedPacientes.push(newPaciente);

    return newPaciente;
}

export async function deletePaciente(pacienteId: string): Promise<void> {
    await delay();
    const index = mockedPacientes.findIndex((p) => p.id === pacienteId);
    if (index === -1) {
        throw new Error("Paciente not found");
    }
    mockedPacientes.splice(index, 1);
}

export async function updatePaciente(pacienteId: string, pacienteData: RegisterPaciente): Promise<Paciente> {
    await delay();
    const index = mockedPacientes.findIndex((p) => p.id === pacienteId);

    if (index === -1) {
        throw new Error("Paciente not found");
    }

    mockedPacientes[index] = {
        ...mockedPacientes[index],
        ...pacienteData,
    };

    return mockedPacientes[index];
}

async function delay(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * MAX_DELAY_MS) + 1;
    return new Promise((resolve) => setTimeout(resolve, randomNumber));
}
