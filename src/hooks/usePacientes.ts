// src/hooks/pacientes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as pacientesService from "../services/pacienteService";
import { Paciente } from "../types";
import { REACT_QUERY_KEYS } from "../constants";

const { PACIENTES } = REACT_QUERY_KEYS;

export function usePacientes() {
    return useQuery<Paciente[]>({
        queryKey: [PACIENTES],
        queryFn: pacientesService.getAll,
    });
}

export function usePacienteMutations() {
    const queryClient = useQueryClient();

    const createPaciente = useMutation({
        mutationFn: pacientesService.create,
        onSuccess: (newPaciente) => {
            queryClient.setQueryData<Paciente[]>([PACIENTES], (old = []) => [...old, newPaciente]);
        },
    });

    const deletePaciente = useMutation({
        mutationFn: pacientesService.deleteById,
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<Paciente[]>([PACIENTES], (old = []) => old.filter((p) => p.id !== deletedId));
        },
    });

    const updatePaciente = useMutation({
        mutationFn: pacientesService.update,
        onSuccess: (updatedPaciente) => {
            queryClient.setQueryData<Paciente[]>([PACIENTES], (old = []) =>
                old.map((p) => (p.id === updatedPaciente.id ? updatedPaciente : p)),
            );
        },
    });

    return {
        createPaciente,
        deletePaciente,
        updatePaciente,
    };
}

export function usePacienteById(id?: string | number) {
    const { data: pacientes } = usePacientes();
    const paciente = pacientes?.find(p => p.id === id);
    
    return {
        data: paciente,
        isLoading: !pacientes,
    };
}
