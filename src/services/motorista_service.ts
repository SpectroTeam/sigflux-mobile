import * as mockFunctions from "../mock_data/motoristas";
import { Motorista, CreateMotoristaDto, UpdateMotoristaDto } from "../types";

export async function getAll(): Promise<Motorista[]> {
    return mockFunctions.getMotoristas();
}

export async function getById(id: string): Promise<Motorista> {
    return mockFunctions.getMotoristaById(id);
}

export async function create(data: CreateMotoristaDto): Promise<Motorista> {
    return mockFunctions.insertMotorista(data);
}

export async function update(id: string, data: UpdateMotoristaDto): Promise<Motorista> {
    return mockFunctions.updateMotorista(id, data);
}

export async function deleteById(id: string): Promise<void> {
    return mockFunctions.deleteMotorista(id);
}
