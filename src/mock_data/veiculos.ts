import { Veiculo, CreateVeiculoDto } from "../types";

// tempo maximo de delay em milisegundos
const MAX_DELAY_MS = 1000;

let veiculos_key = 4;

const mockedVeiculos: Veiculo[] = [
    {
        "id": "1",
        "placa": "XYZ9H7",
        "chassi": "hijk123lm456n",
        "modelo": "doblo",
        "ano": 2020,
        "cor": "prata",
        "capacidade": 7,
        "status": "inativo",
        "documentosAnexados": [ 
            "https://exemplo.com/documentos/crlv-doblo.pdf", 
            "https://exemplo.com/documentos/seguro-doblo.pdf" 
        ]
    },
    {
        "id": "2",
        "placa": "LMN4K8",
        "chassi": "opqr789st012u",
        "modelo": "spin",
        "ano": 2021,
        "cor": "branco",
        "capacidade": 7,
        "status": "inativo",
        "documentosAnexados": [
            "https://exemplo.com/documentos/ipva-spin.pdf",
            "https://exemplo.com/documentos/seguro-spin.pdf"
        ]
    },
    {
        "id": "3",
        "placa": "DEF5G6",
        "chassi": "vwxy345za678b",
        "modelo": "journey",
        "ano": 2018,
        "cor": "azul",
        "capacidade": 7,
        "status": "em viagem",
        "documentosAnexados": [
            "https://exemplo.com/documentos/renavam-journey.pdf", 
            "https://exemplo.com/documentos/laudo-vistoria-journey.pdf"
        ]
    },
    {
        "id": "4",
        "placa": "GHI7J9",
        "chassi": "cdef901gh234i",
        "modelo": "hilux sw4",
        "ano": 2022,
        "cor": "vermelho",
        "capacidade": 7,
        "status": "inativo",
        "documentosAnexados": [
            "https://exemplo.com/documentos/seguro-hilux.pdf", 
            "https://exemplo.com/documentos/contrato-financiamento-hilux.pdf"
        ]
    }

];

export async function getVeiculos(): Promise<Veiculo[]> {
    await delay();
    return deepCopy(mockedVeiculos);
}

export async function getVeiculoById(veiculoId: string): Promise<Veiculo> {
    await delay();
    const veiculo = mockedVeiculos.find((v) => v.id === veiculoId);
    if (!veiculo) {
        throw new Error("Veiculo not found");
    }
    return deepCopy(veiculo);
}

export async function insertVeiculo(veiculo: CreateVeiculoDto): Promise<Veiculo> {
    await delay();

    const newVeiculo: Veiculo = {
        ...veiculo,
        id: (veiculos_key++).toString(),
    };
    mockedVeiculos.push(newVeiculo);

    return deepCopy(newVeiculo);
}

export async function deleteVeiculo(veiculoId: string): Promise<void> {
    await delay();
    const index = mockedVeiculos.findIndex((v) => v.id === veiculoId);
    if (index === -1) {
        throw new Error("Veiculo not found");
    }
    mockedVeiculos.splice(index, 1);
}

export async function updateVeiculo(VeiculoId: string, veiculoData: CreateVeiculoDto): Promise<Veiculo> {
    await delay();
    const index = mockedVeiculos.findIndex((v) => v.id === VeiculoId);

    if (index === -1) {
        throw new Error("Veiculo not found");
    }

    mockedVeiculos[index] = {
        ...mockedVeiculos[index],
        ...veiculoData,
    };

    return deepCopy(mockedVeiculos[index]);
}

async function delay(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * MAX_DELAY_MS) + 1;
    return new Promise((resolve) => setTimeout(resolve, randomNumber));
}

function deepCopy<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}
