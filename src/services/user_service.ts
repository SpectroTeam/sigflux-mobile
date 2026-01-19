import * as mockFunctions from "../mock_data/index";
import { User, CreateUserDto, UpdateUserDto } from "../types";

export async function getAll(): Promise<User[]> {
    return mockFunctions.getUsers();
}

export async function getById(id: string): Promise<User> {
    return mockFunctions.getUserById(id);
}

export async function create(data: CreateUserDto): Promise<User> {
    return mockFunctions.insertUser(data);
}

export async function update(id: string, data: UpdateUserDto): Promise<User> {
    return mockFunctions.updateUser(id, data);
}

export async function deleteById(id: string): Promise<void> {
    return mockFunctions.deleteUser(id);
}
