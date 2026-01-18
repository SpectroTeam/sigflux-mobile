import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as motoristaService from "../services/motorista_service";
import { Motorista, CreateMotoristaDto, UpdateMotoristaDto } from "../types";
import { REACT_QUERY_KEYS } from "../constants";

const { MOTORISTAS } = REACT_QUERY_KEYS;

export function useMotoristas() {
    return useQuery<Motorista[]>({
        queryKey: [MOTORISTAS],
        queryFn: motoristaService.getAll,
    });
}

export function useMotoristaMutations() {
    const queryClient = useQueryClient();

    const createMotorista = useMutation({
        mutationFn: (data: CreateMotoristaDto) => motoristaService.create(data),
        onSuccess: (newMotorista) => {
            queryClient.setQueryData<Motorista[]>([MOTORISTAS], (old = []) => [
                ...old,
                newMotorista,
            ]);
        },
    });

    const updateMotorista = useMutation({
        mutationFn: (vars: { id: string; data: UpdateMotoristaDto }) =>
            motoristaService.update(vars.id, vars.data),
        onSuccess: (updatedMotorista) => {
            queryClient.setQueryData<Motorista[]>([MOTORISTAS], (old = []) =>
                old.map((m) => (m.id === updatedMotorista.id ? updatedMotorista : m)),
            );
        },
    });

    const deleteMotorista = useMutation({
        mutationFn: (id: string) => motoristaService.deleteById(id),
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<Motorista[]>([MOTORISTAS], (old = []) =>
                old.filter((m) => m.id !== deletedId),
            );
        },
    });

    return {
        createMotorista,
        updateMotorista,
        deleteMotorista,
    };
}

export function useMotoristaById(id?: string) {
    const { data: motoristas, isLoading } = useMotoristas();

    const motorista = motoristas?.find((m) => m.id === id);

    return {
        motorista,
        isLoading,
    };
}
