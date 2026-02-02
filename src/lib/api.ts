import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { ENV } from '../config/env';

// URL base da API - configurada em src/config/index.ts
const API_BASE_URL = ENV.API_URL;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestConfig {
    method?: RequestMethod;
    body?: unknown;
    headers?: Record<string, string>;
    skipAuth?: boolean;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async getAuthToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        } catch {
            return null;
        }
    }

    async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const { method = 'GET', body, headers = {}, skipAuth = false } = config;

        const url = `${this.baseUrl}${endpoint}`;

        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...headers,
        };

        // Adicionar token de autenticação se não for skipAuth
        if (!skipAuth) {
            const token = await this.getAuthToken();
            if (token) {
                requestHeaders['Authorization'] = `Bearer ${token}`;
            }
        }

        const requestConfig: RequestInit = {
            method,
            headers: requestHeaders,
        };

        if (body && method !== 'GET') {
            requestConfig.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, requestConfig);

            // Se a resposta não tiver conteúdo (204 No Content)
            if (response.status === 204) {
                return {} as T;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na requisição');
            }

            return data as T;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro de conexão com o servidor');
        }
    }

    async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'POST', body });
    }

    async put<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'PUT', body });
    }

    async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }
}

export const api = new ApiClient(API_BASE_URL);

// Para permitir trocar a URL da API em runtime (útil para desenvolvimento)
export function setApiBaseUrl(url: string) {
    (api as any).baseUrl = url;
}

export { API_BASE_URL };
