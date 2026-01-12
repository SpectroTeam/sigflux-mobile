import { findUserByCredentials } from "../mock_data";
import { AuthCredentials, AuthResponse } from "../types";

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
    // const response = await api.post("/auth/login", credentials);
    // return response.data;

    // Mocked response
    const response = await findUserByCredentials(credentials);
    return response;
}
