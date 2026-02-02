import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userService from "../services/user_service";
import { User, CreateUserDto, UpdateUserDto } from "../types";
import { REACT_QUERY_KEYS } from "../constants";

const { USUARIO } = REACT_QUERY_KEYS;

export function useUsuario() {
    return useQuery<User[]>({
        queryKey: [USUARIO],
        queryFn: userService.getAll,
    });
}

export function useUsuarioMutations() {
    const queryClient = useQueryClient();

    const createUsuario = useMutation({
        mutationFn: (data: CreateUserDto) => userService.create(data),
        onSuccess: (newUsuario) => {
            queryClient.setQueryData<User[]>([USUARIO], (old = []) => [
                ...old,
                newUsuario,
            ]);
        },
    });

    const updateUsuario = useMutation({
        mutationFn: (vars: { id: string; data: UpdateUserDto }) =>
            userService.update(vars.id, vars.data),
        onSuccess: (updateUsuario) => {
            queryClient.setQueryData<User[]>([USUARIO], (old = []) =>
                old.map((u) => (u.id === updateUsuario.id ? updateUsuario : u)),
            );
        },
    });

    const deleteUsuario = useMutation({
        mutationFn: (id: string) => userService.deleteById(id),
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<User[]>([USUARIO], (old = []) =>
                old.filter((u) => u.id !== deletedId),
            );
        },
    });

    const changePassword = useMutation({
        mutationFn: (vars: { userId: string; currentPassword: string; newPassword: string }) =>
            userService.changePassword(vars.userId, vars.currentPassword, vars.newPassword),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData<User[]>([USUARIO], (old = []) =>
                old.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
            );
        },
    });

    return {
        createUsuario,
        updateUsuario,
        deleteUsuario,
        changePassword,
    };
}

export function useUsuarioById(id?: string) {
    const { data: usuarios, isLoading } = useUsuario();

    const usuario = usuarios?.find((u) => u.id === id);

    return {
        usuario,
        isLoading,
    };
}
