import { api } from "../lib/api";
import { Veiculo, CreateVeiculoDto, UpdateVeiculoDto } from "../types";

export async function getAll(): Promise<Veiculo[]> {
    return api.get<Veiculo[]>("/veiculos");
}

export async function getById(id: string): Promise<Veiculo> {
    return api.get<Veiculo>(`/veiculos/${id}`);
}

export async function create(data: CreateVeiculoDto): Promise<Veiculo> {
    return api.post<Veiculo>("/veiculos", data);
}

export async function update(id: string, data: UpdateVeiculoDto): Promise<Veiculo> {
    return api.put<Veiculo>(`/veiculos/${id}`, data);
}

export async function deleteById(id: string): Promise<void> {
    return api.delete(`/veiculos/${id}`);
}

export async function getAvailableVeiculos(): Promise<Veiculo[]> {
    return api.get<Veiculo[]>("/veiculos/available");
}
