import { Viagem, CreateViagemDto } from "../types";

// tempo maximo de delay em milisegundos
const MAX_DELAY_MS = 1000;

let viagens_key = 4;

const mockedViagens: Viagem[] = [
    {
        "id": "1",
        "data_hora": new Date(1980, 5, 15).toISOString(),
        "status": "Concluída",
        "tipo": "Ida",
        "cidade_destino": "Campina Grande",
        "veiculo": [
            {
                "id": "1",
                "placa": "XYZ9H7",
                "chassi": "hijk123lm456n",
                "modelo": "doblo",
                "ano": 2020,
                "cor": "prata",
                "capacidade": 7,
                "status": "Inativo",
            }
        ],
        "motorista": [
            {
                id: "1",
                nome: "João Silva",
                telefone: "(11) 91234-5678",
                matricula: "MTR001",
            }
        ],
        "passageiros": [
            {
                id: "1",
                nome: "José Fernando Alves",
                cpf: "234.567.890-11",
                rg: "1.234.567-8",
                endereco: "Rua A, 123, Cidade X",
                telefone: "(11) 91234-5678",
                birthDate: new Date(1980, 5, 15).toISOString(),
                status: "inativo",
            },
        ],
        "paradas": [
            {
                id: "1",
                nome: "Casa Esperança",
                endereco: "Rua das Flores, 123",
                capacidadeMaxima: 20,
                lotacaoAtual: 15,
            }
        ]
    },
    {
        "id": "2",
        "data_hora": new Date(1980, 5, 15).toISOString(),
        "status": "Concluída",
        "tipo": "Ida",
        "cidade_destino": "João Pessoa",
        "veiculo": [
            {
                "id": "2",
                "placa": "LMN4K8",
                "chassi": "opqr789st012u",
                "modelo": "spin",
                "ano": 2021,
                "cor": "branco",
                "capacidade": 7,
                "status": "Inativo",
            }
        ],
        "motorista": [
            {
                id: "2",
                nome: "Maria Oliveira",
                telefone: "(21) 92345-6789",
                matricula: "MTR002",
            }
        ],
        "passageiros": [
            {
                id: "2",
                nome: "Maria Silva Santos",
                cpf: "123.456.789-00",
                rg: "2.345.678-9",
                endereco: "Avenida B, 456, Cidade Y",
                telefone: "(21) 92345-6789",
                birthDate: new Date(1990, 10, 20).toISOString(),
                status: "inativo",
            },
            {
                id: "a4",
                nome: "Pedro Santos",
                cpf: "654.321.098-77",
                telefone: "(21) 96543-2109",
                parentesco: "conjuge",
            }
        ],
        "paradas": [
            {
                id: "2",
                nome: "Casa Vida Nova",
                endereco: "Av. Central, 456",
                capacidadeMaxima: 10,
                lotacaoAtual: 10,
            }
        ]
    },
    {
        "id": "3",
        "data_hora": new Date(1980, 5, 15).toISOString(),
        "status": "Concluída",
        "tipo": "Ida",
        "cidade_destino": "Campina Grande",
        "veiculo": [
            {
                "id": "3",
                "placa": "DEF5G6",
                "chassi": "vwxy345za678b",
                "modelo": "journey",
                "ano": 2018,
                "cor": "azul",
                "capacidade": 7,
                "status": "Em viagem",
            }
        ],
        "motorista": [
            {
                id: "3",
                nome: "Carlos Souza",
                telefone: "(31) 93456-7890",
                matricula: "MTR003",
            }
        ],
        "passageiros": [
            {
                id: "3",
                nome: "João Pedro Costa",
                cpf: "345.678.901-22",
                rg: "3.456.789-0",
                endereco: "Travessa  C, 789, Cidade Z",
                telefone: "(31) 93456-7890",
                birthDate: new Date(1975, 2, 5).toISOString(),
                status: "inativo",
            },
            {
                id: "a1",
                nome: "Ana Alves",
                cpf: "987.654.321-00",
                telefone: "(11) 99876-5432",
                parentesco: "conjuge",
            }
        ],
        "paradas": [
            {
                id: "3",
                nome: "Casa Acolher",
                endereco: "Rua do Sol, 89",
                capacidadeMaxima: 15,
                lotacaoAtual: 6,
            }
        ]
    },
]
    ;

export async function getViagens(): Promise<Viagem[]> {
    await delay();
    return deepCopy(mockedViagens);
}

export async function getViagemById(viagemId: string): Promise<Viagem> {
    await delay();
    const viagem = mockedViagens.find((v) => v.id === viagemId);
    if (!viagem) {
        throw new Error("Viagem not found");
    }
    return deepCopy(viagem);
}

export async function insertViagem(viagem: CreateViagemDto): Promise<Viagem> {
    await delay();

    const newViagem: Viagem = {
        ...viagem,
        id: (viagens_key++).toString(),
    };
    mockedViagens.push(newViagem);

    return deepCopy(newViagem);
}

export async function deleteViagem(viagemId: string): Promise<void> {
    await delay();
    const index = mockedViagens.findIndex((v) => v.id === viagemId);
    if (index === -1) {
        throw new Error("Viagem not found");
    }
    mockedViagens.splice(index, 1);
}

export async function updateViagem(viagemId: string, viagemData: CreateViagemDto): Promise<Viagem> {
    await delay();
    const index = mockedViagens.findIndex((v) => v.id === viagemId);

    if (index === -1) {
        throw new Error("Viagem not found");
    }

    mockedViagens[index] = {
        ...mockedViagens[index],
        ...viagemData,
    };

    return deepCopy(mockedViagens[index]);
}

async function delay(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * MAX_DELAY_MS) + 1;
    return new Promise((resolve) => setTimeout(resolve, randomNumber));
}

function deepCopy<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}
