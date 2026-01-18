import * as mockFunctions from "../mock_data/casasApoio";
import { CasaApoio, CreateCasaApoioDto, UpdateCasaApoioDto } from "../types";

export async function getAll(): Promise<CasaApoio[]> {
    return mockFunctions.getCasasApoio();
}

export async function getById(id: string): Promise<CasaApoio | undefined> {
    return mockFunctions.getCasaApoioById(id);
}

export async function create(data: CreateCasaApoioDto): Promise<CasaApoio> {
    return mockFunctions.insertCasaApoio(data);
}

export async function update(id: string, data: UpdateCasaApoioDto): Promise<CasaApoio> {
    return mockFunctions.updateCasaApoio(id, data);
}

export async function deleteById(id: string): Promise<void> {
    return mockFunctions.deleteCasaApoio(id);
}
