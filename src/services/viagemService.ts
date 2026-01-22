import * as mockFunctions from "../mock_data/viagens";
import { Viagem, CreateViagemDto, updateViagemDto } from "../types";

export async function getAll(): Promise<Viagem[]> {
    return mockFunctions.getViagens();
}

export async function getById(id: string): Promise<Viagem> {
    return mockFunctions.getViagemById(id);
}

export async function create(data: CreateViagemDto): Promise<Viagem> {
    return mockFunctions.insertViagem(data);
}

export async function update(id: string, data: updateViagemDto): Promise<Viagem> {
    return mockFunctions.updateViagem(id, data);
}

export async function deleteById(id: string): Promise<void> {
    return mockFunctions.deleteViagem(id);
}
