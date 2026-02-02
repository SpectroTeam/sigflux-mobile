import { api } from "../lib/api";
import { AuthCredentials, AuthResponse } from "../types";

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials, { skipAuth: true });
    return response;
}

export async function validateToken(): Promise<{ valid: boolean; user?: AuthResponse['user'] }> {
    try {
        const response = await api.post<{ valid: boolean; user?: AuthResponse['user'] }>("/auth/validate");
        return response;
    } catch {
        return { valid: false };
    }
}
