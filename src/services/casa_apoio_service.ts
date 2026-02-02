import { api } from "../lib/api";
import { CasaApoio, CreateCasaApoioDto, UpdateCasaApoioDto } from "../types";

export async function getAll(): Promise<CasaApoio[]> {
    return api.get<CasaApoio[]>("/casas-apoio");
}

export async function getById(id: string): Promise<CasaApoio | undefined> {
    try {
        return await api.get<CasaApoio>(`/casas-apoio/${id}`);
    } catch {
        return undefined;
    }
}

export async function create(data: CreateCasaApoioDto): Promise<CasaApoio> {
    return api.post<CasaApoio>("/casas-apoio", data);
}

export async function update(id: string, data: UpdateCasaApoioDto): Promise<CasaApoio> {
    return api.put<CasaApoio>(`/casas-apoio/${id}`, data);
}

export async function deleteById(id: string): Promise<void> {
    return api.delete(`/casas-apoio/${id}`);
}
