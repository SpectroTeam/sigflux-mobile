import { QueryClient } from "@tanstack/react-query";
import { REACT_QUERY_DEFAULTS } from "../constants";

// configuração do QueryClient para react query
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: REACT_QUERY_DEFAULTS.staleTime,
            retry: REACT_QUERY_DEFAULTS.retry,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: true,
        },
    },
});

