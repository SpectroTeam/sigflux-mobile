import { api } from "../lib/api";
import { Acompanhante, CreateAcompanhanteDto, CreatePacienteDto, Paciente, UpdatePacienteDto, UpdateAcompanhanteDto } from "../types";

export async function getAll(): Promise<Paciente[]> {
    return api.get<Paciente[]>("/pacientes");
}

export async function getById(pacienteId: string): Promise<Paciente> {
    return api.get<Paciente>(`/pacientes/${pacienteId}`);
}

export async function create(data: CreatePacienteDto): Promise<Paciente> {
    return api.post<Paciente>("/pacientes", data);
}

export async function update(pacienteId: string, data: UpdatePacienteDto): Promise<Paciente> {
    return api.put<Paciente>(`/pacientes/${pacienteId}`, data);
}

export async function deleteById(pacienteId: string): Promise<void> {
    return api.delete(`/pacientes/${pacienteId}`);
}

// acompanhantes related functions

export async function addAcompanhante(pacienteId: string, acompanhante: CreateAcompanhanteDto): Promise<Acompanhante> {
    return api.post<Acompanhante>(`/pacientes/${pacienteId}/acompanhantes`, acompanhante);
}

export async function updateAcompanhante(
    pacienteId: string,
    acompanhanteId: string,
    acompanhanteData: UpdateAcompanhanteDto,
): Promise<Acompanhante> {
    return api.put<Acompanhante>(`/pacientes/${pacienteId}/acompanhantes/${acompanhanteId}`, acompanhanteData);
}

export async function deleteAcompanhante(pacienteId: string, acompanhanteId: string): Promise<void> {
    return api.delete(`/pacientes/${pacienteId}/acompanhantes/${acompanhanteId}`);
}
