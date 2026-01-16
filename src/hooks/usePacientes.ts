// src/hooks/pacientes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as pacientesService from "../services/pacienteService";
import { Paciente, UpdatePacienteDto, CreateAcompanhanteDto, UpdateAcompanhanteDto } from "../types";
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
        mutationFn: (vars: { pacienteId: string, data: UpdatePacienteDto }) => 
            pacientesService.update(vars.pacienteId, vars.data),
        onSuccess: (updatedPaciente) => {
            queryClient.setQueryData<Paciente[]>([PACIENTES], (old = []) =>
                old.map((p) => (p.id === updatedPaciente.id ? updatedPaciente : p)),
            );
        },
    });

    const addAcompanhante = useMutation({
        mutationFn: (vars: { pacienteId: string; acompanhante: CreateAcompanhanteDto }) =>
            pacientesService.addAcompanhante(vars.pacienteId, vars.acompanhante),
        onSuccess: (acompanhante, vars) => {
            const { pacienteId } = vars;
            const newAcompanhante = acompanhante;

            queryClient.setQueryData<Paciente[]>([PACIENTES], (old = []) => {
                const pacienteIndex = old.findIndex((p) => p.id === pacienteId);
                if (pacienteIndex === -1) return old;

                const paciente = old[pacienteIndex];
                const updatedPaciente = {
                    ...paciente,
                    acompanhantes: [...(paciente.acompanhantes || []), newAcompanhante],
                };

                const newPacientes = [...old];
                newPacientes[pacienteIndex] = updatedPaciente;
                return newPacientes;
            });
        },
    });

    const updateAcompanhante = useMutation({
        mutationFn: (vars: { pacienteId: string; acompanhanteId: string; acompanhanteData: UpdateAcompanhanteDto }) =>
            pacientesService.updateAcompanhante(vars.pacienteId, vars.acompanhanteId, vars.acompanhanteData),
        onSuccess: (updatedAcompanhante, vars) => {
            const { pacienteId, acompanhanteId } = vars;

            queryClient.setQueryData<Paciente[]>([PACIENTES], (old = []) => {
                const pacienteIndex = old.findIndex((p) => p.id === pacienteId);
                if (pacienteIndex === -1) return old;

                const paciente = old[pacienteIndex];
                const updatedPaciente = {
                    ...paciente,
                    acompanhantes:
                        paciente.acompanhantes?.map((a) => (a.id === acompanhanteId ? updatedAcompanhante : a)) || [],
                };

                const newPacientes = [...old];
                newPacientes[pacienteIndex] = updatedPaciente;
                return newPacientes;
            });
        },
    });

    const deleteAcompanhante = useMutation({
        mutationFn: (vars: { pacienteId: string; acompanhanteId: string }) =>
            pacientesService.deleteAcompanhante(vars.pacienteId, vars.acompanhanteId),
        onSuccess: (_, vars) => {
            const { pacienteId, acompanhanteId } = vars;

            queryClient.setQueryData<Paciente[]>([PACIENTES], (old = []) => {
                const pacienteIndex = old.findIndex((p) => p.id === pacienteId);
                if (pacienteIndex === -1) return old;

                const paciente = old[pacienteIndex];
                const updatedPaciente = {
                    ...paciente,
                    acompanhantes: paciente.acompanhantes?.filter((a) => a.id !== acompanhanteId) || [],
                };

                const newPacientes = [...old];
                newPacientes[pacienteIndex] = updatedPaciente;
                return newPacientes;
            });
        },
    });

    return {
        createPaciente,
        deletePaciente,
        updatePaciente,
        addAcompanhante,
        updateAcompanhante,
        deleteAcompanhante,
    };
}

export function usePacienteById(id?: string) {
    const { data: pacientes } = usePacientes();
    const paciente = pacientes?.find((p) => p.id === id);

    return {
        data: paciente,
        isLoading: !pacientes,
    };
}
