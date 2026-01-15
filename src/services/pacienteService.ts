import { deletePaciente, getPacienteById, getPacientes, insertPaciente, updatePaciente } from "../mock_data";
import { Paciente, CreatePacienteDto, UpdatePacienteDto } from "../types";

export async function getAll() {
    const response = await getPacientes();
    return response;
}

export async function getById(pacienteId: string) {
    const paciente = await getPacienteById(pacienteId);
    return paciente;
}

export async function create(data: CreatePacienteDto): Promise<Paciente> {
    const response = await insertPaciente(data);
    return response;
}

export async function update(pacienteId: string, data: UpdatePacienteDto): Promise<Paciente> {
    const response = await updatePaciente(pacienteId, data);
    return response;
}

export async function deleteById(pacienteId: string) {
    await deletePaciente(pacienteId);
    return;
}
