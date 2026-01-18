import { Motorista, CreateMotoristaDto } from "../types";

// tempo maximo de delay em milisegundos
const MAX_DELAY_MS = 1000;

let motoristas_key = 4;

const mockedMotoristas: Motorista[] = [
    {
        id: "1",
        nome: "João Silva",
        telefone: "(11) 91234-5678",
        matricula: "MTR001",
        documentosAnexados: [
            "https://exemplo.com/documentos/cnh-joao.pdf",
            "https://exemplo.com/documentos/comprovante-residencia-joao.pdf",
        ],
    },
    {
        id: "2",
        nome: "Maria Oliveira",
        telefone: "(21) 92345-6789",
        matricula: "MTR002",
        documentosAnexados: [
            "https://exemplo.com/documentos/cnh-maria.pdf",
        ],
    },
    {
        id: "3",
        nome: "Carlos Souza",
        telefone: "(31) 93456-7890",
        matricula: "MTR003",
        documentosAnexados: [],
    },
];

export async function getMotoristas(): Promise<Motorista[]> {
    await delay();
    return deepCopy(mockedMotoristas);
}

export async function getMotoristaById(motoristaId: string): Promise<Motorista> {
    await delay();
    const motorista = mockedMotoristas.find((m) => m.id === motoristaId);
    if (!motorista) {
        throw new Error("Motorista not found");
    }
    return deepCopy(motorista);
}

export async function insertMotorista(motorista: CreateMotoristaDto): Promise<Motorista> {
    await delay();

    const newMotorista: Motorista = {
        ...motorista,
        id: (motoristas_key++).toString(),
    };
    mockedMotoristas.push(newMotorista);

    return deepCopy(newMotorista);
}

export async function deleteMotorista(motoristaId: string): Promise<void> {
    await delay();
    const index = mockedMotoristas.findIndex((m) => m.id === motoristaId);
    if (index === -1) {
        throw new Error("Motorista not found");
    }
    mockedMotoristas.splice(index, 1);
}

export async function updateMotorista(motoristaId: string, motoristaData: CreateMotoristaDto): Promise<Motorista> {
    await delay();
    const index = mockedMotoristas.findIndex((m) => m.id === motoristaId);

    if (index === -1) {
        throw new Error("Motorista not found");
    }

    mockedMotoristas[index] = {
        ...mockedMotoristas[index],
        ...motoristaData,
    };

    return deepCopy(mockedMotoristas[index]);
}

async function delay(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * MAX_DELAY_MS) + 1;
    return new Promise((resolve) => setTimeout(resolve, randomNumber));
}

function deepCopy<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}
