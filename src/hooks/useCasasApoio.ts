import { useCallback, useEffect, useState } from "react";
import * as casaApoioService from "../services/casa_apoio_service";
import { CasaApoio } from "../types";

export function useCasasApoio() {
    const [casasApoio, setCasasApoio] = useState<CasaApoio[]>([]);
    const [loading, setLoading] = useState(false);

    const loadCasasApoio = useCallback(async () => {
        setLoading(true);
        const data = await casaApoioService.getAll();
        setCasasApoio(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadCasasApoio();
    }, [loadCasasApoio]);

    return {
        casasApoio,
        loading,
        reload: loadCasasApoio,
    };
}
