import { useMemo, useState } from "react";
import { PacienteViagem } from "../types";
import { usePacientes } from "./usePacientes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as viagemService from "../services/viagemService";
import { REACT_QUERY_KEYS } from "../constants";
import { PACIENTE_STATUS } from "../constants";

type Params = {
    passageiros: PacienteViagem[];
};

export function useViagemPassageiros({ passageiros, viagemId }: Params & { viagemId: string }) {
    const [editingPacienteId, setEditingPacienteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: allPacientes = [] } = usePacientes();
    const queryClient = useQueryClient();

    // Filtrar pacientes disponíveis (não estão na viagem e não estão em outra viagem)
    const availablePacientes = useMemo(() => {
        return allPacientes.filter((paciente) => {
            const notPassenger = !passageiros.some((p) => p.paciente.id === paciente.id);
            const notInOtherTrip = paciente.status !== PACIENTE_STATUS.EM_VIAGEM;
            const matchesSearch =
                paciente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                paciente.cpf.includes(searchQuery.replace(/\D/g, ""));
            return notPassenger && notInOtherTrip && matchesSearch;
        });
    }, [allPacientes, passageiros, searchQuery]);

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.VIAGEM] });
        queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.PACIENTES] });
        queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.VEICULOS] });
    };

    const addPacienteMutation = useMutation({
        mutationFn: ({ pacienteId, acompanhanteId }: { pacienteId: string; acompanhanteId?: string }) =>
            viagemService.addPacienteToViagem(viagemId, pacienteId, acompanhanteId),
        onSuccess: invalidateQueries,
    });

    const removePacienteMutation = useMutation({
        mutationFn: (pacienteId: string) =>
            viagemService.removePacienteFromViagem(viagemId, pacienteId),
        onSuccess: invalidateQueries,
    });

    const updateAcompanhanteMutation = useMutation({
        mutationFn: ({ pacienteId, acompanhanteId }: { pacienteId: string; acompanhanteId?: string }) =>
            viagemService.updatePacienteAcompanhante(viagemId, pacienteId, acompanhanteId),
        onSuccess: invalidateQueries,
    });

    return {
        editingPacienteId,
        setEditingPacienteId,
        searchQuery,
        setSearchQuery,
        availablePacientes,
        addPaciente: addPacienteMutation.mutateAsync,
        removePaciente: removePacienteMutation.mutateAsync,
        updateAcompanhante: updateAcompanhanteMutation.mutateAsync,
        isLoading: addPacienteMutation.isPending || removePacienteMutation.isPending || updateAcompanhanteMutation.isPending,
    };
}
