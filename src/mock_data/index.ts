import { AuthCredentials, AuthResponse, User } from "../types";

// dados mockados porque os responsaveis pelo backend são lerdos demais

type UserWithPassword = User & { password: string };

const mockedUsers: UserWithPassword[] = [
    {
        nome_completo: "Erick",
        cpf: "123.456.789-00",
        email: "erick.gg@email.com",
        matricula: "20230001",
        telefone: "(11) 91234-5678",
        cargo: "Analista",
        password: "password123",
    },
    {
        nome_completo: "Heloisa",
        cpf: "234.567.890-11",
        email: "heloisa.lise@email.com",
        matricula: "20230002",
        telefone: "(21) 92345-6789",
        cargo: "Gerente",
        password: "securepass",
    },
    {
        nome_completo: "Tatiane",
        cpf: "345.678.901-22",
        email: "tatiane.tt@email.com",
        matricula: "20230003",
        telefone: "(31) 93456-7890",
        cargo: "Coordenadora",
        password: "mypassword",
    },
];

export async function findUserByCredentials(credentials: AuthCredentials): Promise<AuthResponse> {
    const { matricula, password } = credentials;
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simula atraso de rede
    const user = mockedUsers.find((user) => user.matricula === matricula && user.password === password);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    return {
        user,
        token: "pangare-paraguaio"
    };
}
