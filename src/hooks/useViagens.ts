import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as viagemService from "../services/viagemService";
import { Viagem, CreateViagemDto, updateViagemDto } from "../types";
import { REACT_QUERY_KEYS } from "../constants";

const { VIAGEM } = REACT_QUERY_KEYS;

export function useViagem() {
    return useQuery<Viagem[]>({
        queryKey: [VIAGEM],
        queryFn: viagemService.getAll,
    });
}

export function useViagemMutations() {
    const queryClient = useQueryClient();

    const craeteViagem = useMutation({
        mutationFn: (data: CreateViagemDto) => viagemService.create(data),
        onSuccess: (newViagem) => {
            queryClient.setQueryData<Viagem[]>([VIAGEM], (old = []) => [
                ...old,
                newViagem,
            ]);
        },
    });

    const updateViagem = useMutation({
        mutationFn: (vars: { id: string; data: updateViagemDto }) =>
            viagemService.update(vars.id, vars.data),
        onSuccess: (updateViagem) => {
            queryClient.setQueryData<Viagem[]>([VIAGEM], (old = []) =>
                old.map((v) => (v.id === updateViagem.id ? updateViagem : v)),
            );
        },
    });

    const deleteViagem = useMutation({
        mutationFn: (id: string) => viagemService.deleteById(id),
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<Viagem[]>([VIAGEM], (old = []) =>
                old.filter((v) => v.id !== deletedId),
            );
        },
    });

    return {
        craeteViagem,
        updateViagem,
        deleteViagem,
    };
}

export function useViagemById(id?: string) {
    const { data: viagens, isLoading } = useViagem();

    const viagem = viagens?.find((v) => v.id === id);

    return {
        viagem,
        isLoading,
    };
}
