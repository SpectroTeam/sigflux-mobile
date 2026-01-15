import * as mockFunctions from "../mock_data";
import { Acompanhante, CreateAcompanhanteDto, CreatePacienteDto, Paciente, UpdatePacienteDto } from "../types";

export async function getAll() {
    const response = await mockFunctions.getPacientes();
    return response;
}

export async function getById(pacienteId: string) {
    const paciente = await mockFunctions.getPacienteById(pacienteId);
    return paciente;
}

export async function create(data: CreatePacienteDto): Promise<Paciente> {
    const response = await mockFunctions.insertPaciente(data);
    return response;
}

export async function update(pacienteId: string, data: UpdatePacienteDto): Promise<Paciente> {
    const response = await mockFunctions.updatePaciente(pacienteId, data);
    return response;
}

export async function deleteById(pacienteId: string) {
    await mockFunctions.deletePaciente(pacienteId);
    return;
}

// acompanhantes related functions

export async function addAcompanhante(pacienteId: string, acompanhante: CreateAcompanhanteDto): Promise<Acompanhante> {
    const response = await mockFunctions.addAcompanhante(pacienteId, acompanhante);
    return response;
}

export async function updateAcompanhante(
    pacienteId: string,
    acompanhanteId: string,
    acompanhanteData: CreateAcompanhanteDto,
): Promise<Acompanhante> {
    const response = await mockFunctions.updateAcompanhante(pacienteId, acompanhanteId, acompanhanteData);
    return response;
}

export async function deleteAcompanhante(pacienteId: string, acompanhanteId: string): Promise<void> {
    await mockFunctions.deleteAcompanhante(pacienteId, acompanhanteId);
    return;
}
