import { CasaApoio } from "../types";

let casasApoio: CasaApoio[] = [
    {
        id: "1",
        nome: "Casa Esperança",
        endereco: "Rua das Flores, 123",
        capacidadeMaxima: 20,
        lotacaoAtual: 15,
    },
    {
        id: "2",
        nome: "Casa Vida Nova",
        endereco: "Av. Central, 456",
        capacidadeMaxima: 10,
        lotacaoAtual: 10,
    },
    {
        id: "3",
        nome: "Casa Acolher",
        endereco: "Rua do Sol, 89",
        capacidadeMaxima: 15,
        lotacaoAtual: 6,
    },
];

export async function getCasasApoio(): Promise<CasaApoio[]> {
    return casasApoio;
}

export async function getCasaApoioById(id: string): Promise<CasaApoio | undefined> {
    return casasApoio.find((c) => c.id === id);
}

export async function insertCasaApoio(data: Omit<CasaApoio, "id">): Promise<CasaApoio> {
    const newCasa: CasaApoio = {
        id: Date.now().toString(),
        ...data,
    };

    casasApoio.push(newCasa);
    return newCasa;
}

export async function updateCasaApoio(id: string, data: Omit<CasaApoio, "id">): Promise<CasaApoio> {
    const index = casasApoio.findIndex((c) => c.id === id);
    casasApoio[index] = { ...casasApoio[index], ...data };
    return casasApoio[index];
}

export async function deleteCasaApoio(id: string): Promise<void> {
    casasApoio = casasApoio.filter((c) => c.id !== id);
}
