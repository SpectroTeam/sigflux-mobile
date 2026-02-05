// função para formatar cpf automaticamente
export function formatCPF(value: string) {
    const digits = value.replace(/\D/g, "");

    return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .slice(0, 14);
}

// função para formatar cpf automaticamente
export function formatRG(value: string) {
    const digits = value.replace(/\D/g, "");

    return digits
        .replace(/(\d{1})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .slice(0, 9);
}

// função para formatar telefone automaticamente
export function formatPhone(value: string): string {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
}

export function formatDateBR(value: string): string {
    return new Date(value).toLocaleDateString("pt-BR");
}
