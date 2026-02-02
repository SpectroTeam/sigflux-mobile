import { api } from "../lib/api";
import { User, CreateUserDto, UpdateUserDto } from "../types";

export async function getAll(): Promise<User[]> {
    return api.get<User[]>("/users");
}

export async function getById(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
}

export async function create(data: CreateUserDto): Promise<User> {
    return api.post<User>("/users", data);
}

export async function update(id: string, data: UpdateUserDto): Promise<User> {
    return api.put<User>(`/users/${id}`, data);
}

export async function deleteById(id: string): Promise<void> {
    return api.delete(`/users/${id}`);
}

export async function changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
): Promise<User> {
    return api.put<User>(`/users/${userId}/password`, { currentPassword, newPassword });
}
