import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as viagemService from "../services/viagemService";
import { Viagem, CreateViagemDto, updateViagemDto } from "../types";
import { REACT_QUERY_KEYS } from "../constants";

const { VIAGEM, VEICULOS, PACIENTES } = REACT_QUERY_KEYS;

export function useViagem() {
    return useQuery<Viagem[]>({
        queryKey: [VIAGEM],
        queryFn: viagemService.getAll,
    });
}

export function useViagemMutations() {
    const queryClient = useQueryClient();

    const invalidateAllRelated = () => {
        queryClient.invalidateQueries({ queryKey: [VIAGEM] });
        queryClient.invalidateQueries({ queryKey: [VEICULOS] });
        queryClient.invalidateQueries({ queryKey: [PACIENTES] });
    };

    const craeteViagem = useMutation({
        mutationFn: (data: CreateViagemDto) => viagemService.create(data),
        onSuccess: (newViagem) => {
            queryClient.setQueryData<Viagem[]>([VIAGEM], (old = []) => [
                ...old,
                newViagem,
            ]);
            invalidateAllRelated();
        },
    });

    const updateViagem = useMutation({
        mutationFn: (vars: { id: string; data: updateViagemDto }) =>
            viagemService.update(vars.id, vars.data),
        onSuccess: (updateViagem) => {
            queryClient.setQueryData<Viagem[]>([VIAGEM], (old = []) =>
                old.map((v) => (v.id === updateViagem.id ? updateViagem : v)),
            );
            invalidateAllRelated();
        },
    });

    const deleteViagem = useMutation({
        mutationFn: (id: string) => viagemService.deleteById(id),
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<Viagem[]>([VIAGEM], (old = []) =>
                old.filter((v) => v.id !== deletedId),
            );
            invalidateAllRelated();
        },
    });

    const addParada = useMutation({
        mutationFn: (vars: { viagemId: string; casaApoioId: string }) =>
            viagemService.addParadaToViagem(vars.viagemId, vars.casaApoioId),
        onSuccess: (updatedViagem) => {
            queryClient.setQueryData<Viagem[]>([VIAGEM], (old = []) =>
                old.map((v) => (v.id === updatedViagem.id ? updatedViagem : v)),
            );
        },
    });

    const removeParada = useMutation({
        mutationFn: (vars: { viagemId: string; casaApoioId: string }) =>
            viagemService.removeParadaFromViagem(vars.viagemId, vars.casaApoioId),
        onSuccess: (updatedViagem) => {
            queryClient.setQueryData<Viagem[]>([VIAGEM], (old = []) =>
                old.map((v) => (v.id === updatedViagem.id ? updatedViagem : v)),
            );
        },
    });

    const iniciarViagem = useMutation({
        mutationFn: (viagemId: string) => viagemService.iniciarViagem(viagemId),
        onSuccess: (updatedViagem) => {
            queryClient.setQueryData<Viagem[]>([VIAGEM], (old = []) =>
                old.map((v) => (v.id === updatedViagem.id ? updatedViagem : v)),
            );
            invalidateAllRelated();
        },
    });

    const concluirViagem = useMutation({
        mutationFn: (viagemId: string) => viagemService.concluirViagem(viagemId),
        onSuccess: (updatedViagem) => {
            queryClient.setQueryData<Viagem[]>([VIAGEM], (old = []) =>
                old.map((v) => (v.id === updatedViagem.id ? updatedViagem : v)),
            );
            invalidateAllRelated();
        },
    });

    return {
        craeteViagem,
        updateViagem,
        deleteViagem,
        addParada,
        removeParada,
        iniciarViagem,
        concluirViagem,
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
