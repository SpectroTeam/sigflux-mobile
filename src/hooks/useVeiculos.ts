import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as veiculoService from "../services/veiculo_service";
import { Veiculo, CreateVeiculoDto, UpdateVeiculoDto } from "../types";
import { REACT_QUERY_KEYS } from "../constants";

const { VEICULOS } = REACT_QUERY_KEYS;

export function useVeiculos() {
    return useQuery<Veiculo[]>({
        queryKey: [VEICULOS],
        queryFn: veiculoService.getAll,
    });
}

export function useVeiculoMutations() {
    const queryClient = useQueryClient();

    const createVeiculo = useMutation({
        mutationFn: (data: CreateVeiculoDto) => veiculoService.create(data),
        onSuccess: (newVeiculo) => {
            queryClient.setQueryData<Veiculo[]>([VEICULOS], (old = []) => [
                ...old,
                newVeiculo,
            ]);
        },
    });

    const updateVeiculo = useMutation({
        mutationFn: (vars: { id: string; data: UpdateVeiculoDto }) =>
            veiculoService.update(vars.id, vars.data),
        onSuccess: (updateVeiculo) => {
            queryClient.setQueryData<Veiculo[]>([VEICULOS], (old = []) =>
                old.map((v) => (v.id === updateVeiculo.id ? updateVeiculo : v)),
            );
        },
    });

    const deleteVeiculo = useMutation({
        mutationFn: (id: string) => veiculoService.deleteById(id),
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<Veiculo[]>([VEICULOS], (old = []) =>
                old.filter((v) => v.id !== deletedId),
            );
        },
    });

    return {
        createVeiculo,
        updateVeiculo,
        deleteVeiculo,
    };
}

export function useVeiculoById(id?: string) {
    const { data: veiculos, isLoading } = useVeiculos();

    const veiculo = veiculos?.find((v) => v.id === id);

    return {
        veiculo,
        isLoading,
    };
}
