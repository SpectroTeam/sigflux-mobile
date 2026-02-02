import * as mockFunctions from "../mock_data/veiculos";
import { Veiculo, CreateVeiculoDto, UpdateVeiculoDto } from "../types";

export async function getAll(): Promise<Veiculo[]> {
    return mockFunctions.getVeiculos();
}

export async function getById(id: string): Promise<Veiculo> {
    return mockFunctions.getVeiculoById(id);
}

export async function create(data: CreateVeiculoDto): Promise<Veiculo> {
    return mockFunctions.insertVeiculo(data);
}

export async function update(id: string, data: UpdateVeiculoDto): Promise<Veiculo> {
    return mockFunctions.updateVeiculo(id, data);
}

export async function deleteById(id: string): Promise<void> {
    return mockFunctions.deleteVeiculo(id);
}

export function getAvailableVeiculos(): Veiculo[] {
    return mockFunctions.getAvailableVeiculos();
}
