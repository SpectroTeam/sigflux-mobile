import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as casaApoioService from "../services/casa_apoio_service";
import { CasaApoio, CreateCasaApoioDto, UpdateCasaApoioDto } from "../types";
import { REACT_QUERY_KEYS } from "../constants";
import { useQuery } from "@tanstack/react-query";

// export function useCasasApoio() {
//     const [casasApoio, setCasasApoio] = useState<CasaApoio[]>([]);
//     const [loading, setLoading] = useState(false);

//     const loadCasasApoio = useCallback(async () => {
//         setLoading(true);
//         const data = await casaApoioService.getAll();
//         setCasasApoio(data);
//         setLoading(false);
//     }, []);

//     useEffect(() => {
//         loadCasasApoio();
//     }, [loadCasasApoio]);

//     return {
//         casasApoio,
//         loading,
//         reload: loadCasasApoio,
//     };
// }
const { CASA_APOIO } = REACT_QUERY_KEYS;

export function useCasasApoio() {
    return useQuery<CasaApoio[]>({
        queryKey: [CASA_APOIO],
        queryFn: casaApoioService.getAll,
    });
}

// Hook para buscar uma casa de apoio pelo ID
// export function useCasaApoioById(id: string) {
//     const [casaApoio, setCasaApoio] = useState<CasaApoio | undefined>(undefined);
//     const [loading, setLoading] = useState(false);

//     const loadCasaApoio = useCallback(async () => {
//         if (!id) return;
//         setLoading(true);
//         const data = await casaApoioService.getById(id);
//         setCasaApoio(data);
//         setLoading(false);
//     }, [id]);

//     useEffect(() => {
//         loadCasaApoio();
//     }, [loadCasaApoio]);

//     return {
//         casaApoio,
//         loading,
//         reload: loadCasaApoio,
//     };
// }

export function useCasaApoioMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateCasaApoioDto) =>
            casaApoioService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CASA_APOIO] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCasaApoioDto }) =>
            casaApoioService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CASA_APOIO] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            casaApoioService.deleteById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CASA_APOIO] });
        },
    });

    return {
        createCasaApoio: createMutation.mutateAsync,
        updateCasaApoio: updateMutation.mutateAsync,
        deleteCasaApoio: deleteMutation.mutateAsync,

        loading:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending,
    };
}

export function useCasaDeAPoioeById(id?: string) {
    const { data: pacientes } = useCasasApoio();
    const paciente = pacientes?.find((p) => p.id === id);

    return {
        data: paciente,
        isLoading: !pacientes,
    };
}


// // Hook para criar, atualizar e deletar casas de apoio
// export function useCasaApoioMutations() {
//     const [loading, setLoading] = useState(false);
//
//     const createCasaApoio = useCallback(async (data: CreateCasaApoioDto) => {
//         setLoading(true);
//         const newCasa = await casaApoioService.create(data);
//         setLoading(false);
//         return newCasa;
//     }, []);
//
//     const updateCasaApoio = useCallback(async (id: string, data: UpdateCasaApoioDto) => {
//         setLoading(true);
//         const updatedCasa = await casaApoioService.update(id, data);
//         setLoading(false);
//         return updatedCasa;
//     }, []);
//
//     const deleteCasaApoio = useCallback(async (id: string) => {
//         setLoading(true);
//         await casaApoioService.deleteById(id);
//         setLoading(false);
//     }, []);
//
//     return {
//         loading,
//         createCasaApoio,
//         updateCasaApoio,
//         deleteCasaApoio,
//     };
// }
//
// export function useCasaApoioById(id?: string) {
//     const { data: casasApoio, isLoading } = useCasasApoio();
//
//     const casaApoio = casasApoio?.find((c) => c.id === id);
//
//     return {
//         casaApoio,
//         isLoading,
//     };
// }
