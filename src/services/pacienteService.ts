import { deletePaciente, getPacienteById, getPacientes, insertPaciente, updatePaciente } from "../mock_data";
import { Paciente, RegisterPaciente } from "../types";

export async function getAll() {
    await new Promise((resolve) => setTimeout(resolve, 10 * 1000)); // Simulate network delay
    const response = await getPacientes();
    return response;
}

export async function getById(pacienteId: string) {
    const paciente = await getPacienteById(pacienteId);
    return paciente;
}

export async function create(data: RegisterPaciente): Promise<Paciente> {
    const response = await insertPaciente(data);
    return response;
}

export async function update(data: Paciente): Promise<Paciente> {
    const response = await updatePaciente(data.id, data);
    return response;
}

export async function deleteById(pacienteId: string) {
    await deletePaciente(pacienteId);
    return;
}
