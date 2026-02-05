import { api } from "../lib/api";
import { Motorista, CreateMotoristaDto, UpdateMotoristaDto } from "../types";

export async function getAll(): Promise<Motorista[]> {
    return api.get<Motorista[]>("/motoristas");
}

export async function getById(id: string): Promise<Motorista> {
    return api.get<Motorista>(`/motoristas/${id}`);
}

export async function create(data: CreateMotoristaDto): Promise<Motorista> {
    return api.post<Motorista>("/motoristas", data);
}

export async function update(id: string, data: UpdateMotoristaDto): Promise<Motorista> {
    return api.put<Motorista>(`/motoristas/${id}`, data);
}

export async function deleteById(id: string): Promise<void> {
    return api.delete(`/motoristas/${id}`);
}
