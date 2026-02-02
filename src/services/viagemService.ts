import { api } from "../lib/api";
import { Viagem, CreateViagemDto, updateViagemDto } from "../types";

export async function getAll(): Promise<Viagem[]> {
    return api.get<Viagem[]>("/viagens");
}

export async function getById(id: string): Promise<Viagem> {
    return api.get<Viagem>(`/viagens/${id}`);
}

export async function create(data: CreateViagemDto): Promise<Viagem> {
    return api.post<Viagem>("/viagens", data);
}

export async function update(id: string, data: updateViagemDto): Promise<Viagem> {
    return api.put<Viagem>(`/viagens/${id}`, data);
}

export async function deleteById(id: string): Promise<void> {
    return api.delete(`/viagens/${id}`);
}

export async function addPacienteToViagem(
    viagemId: string,
    pacienteId: string,
    acompanhanteId?: string
): Promise<Viagem> {
    return api.post<Viagem>(`/viagens/${viagemId}/passageiros`, { pacienteId, acompanhanteId });
}

export async function removePacienteFromViagem(viagemId: string, pacienteId: string): Promise<Viagem> {
    return api.delete<Viagem>(`/viagens/${viagemId}/passageiros/${pacienteId}`);
}

export async function updatePacienteAcompanhante(
    viagemId: string,
    pacienteId: string,
    acompanhanteId?: string
): Promise<Viagem> {
    return api.put<Viagem>(`/viagens/${viagemId}/passageiros/${pacienteId}/acompanhante`, { acompanhanteId });
}

export async function addParadaToViagem(viagemId: string, casaApoioId: string): Promise<Viagem> {
    return api.post<Viagem>(`/viagens/${viagemId}/paradas`, { casaApoioId });
}

export async function removeParadaFromViagem(viagemId: string, casaApoioId: string): Promise<Viagem> {
    return api.delete<Viagem>(`/viagens/${viagemId}/paradas/${casaApoioId}`);
}

export async function getCapacidadeDisponivel(viagemId: string): Promise<number> {
    const response = await api.get<{ capacidadeDisponivel: number }>(`/viagens/${viagemId}/capacidade`);
    return response.capacidadeDisponivel;
}

export async function iniciarViagem(viagemId: string): Promise<Viagem> {
    return api.post<Viagem>(`/viagens/${viagemId}/iniciar`);
}

export async function concluirViagem(viagemId: string): Promise<Viagem> {
    return api.post<Viagem>(`/viagens/${viagemId}/concluir`);
}
