import { useCallback, useEffect, useState } from "react";
import * as motoristaService from "../services/motorista_service";
import { Motorista, CreateMotoristaDto, UpdateMotoristaDto } from "../types";

// Hook para listar todos os motoristas
export function useMotoristas() {
    const [motoristas, setMotoristas] = useState<Motorista[]>([]);
    const [loading, setLoading] = useState(false);

    const loadMotoristas = useCallback(async () => {
        setLoading(true);
        const data = await motoristaService.getAll();
        setMotoristas(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadMotoristas();
    }, [loadMotoristas]);

    return {
        motoristas,
        loading,
        reload: loadMotoristas,
    };
}

// Hook para buscar motorista por ID
export function useMotoristaById(id: string) {
    const [motorista, setMotorista] = useState<Motorista | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const loadMotorista = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        const data = await motoristaService.getById(id);
        setMotorista(data);
        setLoading(false);
    }, [id]);

    useEffect(() => {
        loadMotorista();
    }, [loadMotorista]);

    return {
        motorista,
        loading,
        reload: loadMotorista,
    };
}

// Hook para criar, atualizar e deletar motoristas
export function useMotoristaMutations() {
    const [loading, setLoading] = useState(false);

    const createMotorista = useCallback(async (data: CreateMotoristaDto) => {
        setLoading(true);
        const newMotorista = await motoristaService.create(data);
        setLoading(false);
        return newMotorista;
    }, []);

    const updateMotorista = useCallback(async (id: string, data: UpdateMotoristaDto) => {
        setLoading(true);
        const updatedMotorista = await motoristaService.update(id, data);
        setLoading(false);
        return updatedMotorista;
    }, []);

    const deleteMotorista = useCallback(async (id: string) => {
        setLoading(true);
        await motoristaService.deleteById(id);
        setLoading(false);
    }, []);

    return {
        loading,
        createMotorista,
        updateMotorista,
        deleteMotorista,
    };
}
