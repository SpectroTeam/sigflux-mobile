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

export async function addPacienteToViagem(
    viagemId: string,
    pacienteId: string,
    acompanhanteId?: string
): Promise<Viagem> {
    return mockFunctions.addPacienteToViagem(viagemId, pacienteId, acompanhanteId);
}

export async function removePacienteFromViagem(viagemId: string, pacienteId: string): Promise<Viagem> {
    return mockFunctions.removePacienteFromViagem(viagemId, pacienteId);
}

export async function updatePacienteAcompanhante(
    viagemId: string,
    pacienteId: string,
    acompanhanteId?: string
): Promise<Viagem> {
    return mockFunctions.updatePacienteAcompanhante(viagemId, pacienteId, acompanhanteId);
}

export async function addParadaToViagem(viagemId: string, casaApoioId: string): Promise<Viagem> {
    return mockFunctions.addParadaToViagem(viagemId, casaApoioId);
}

export async function removeParadaFromViagem(viagemId: string, casaApoioId: string): Promise<Viagem> {
    return mockFunctions.removeParadaFromViagem(viagemId, casaApoioId);
}

export function getCapacidadeDisponivel(viagemId: string): number {
    return mockFunctions.getCapacidadeDisponivel(viagemId);
}
