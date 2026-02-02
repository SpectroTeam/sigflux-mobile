import { useMemo, useState } from "react";
import { Paciente } from "../types";

type Params = {
    pacientes: Paciente[];
    passageiros: Paciente[];
};

export function useViagemPassageiros({ pacientes, passageiros }: Params) {
    const [editingPacienteId, setEditingPacienteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const availablePacientes = useMemo(() => {
        return pacientes.filter((paciente) => {
            const notPassenger = !passageiros.some((p) => p.id === paciente.id);
            const matchesSearch =
                paciente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                paciente.cpf.includes(searchQuery.replace(/\D/g, ""));
            return notPassenger && matchesSearch;
        });
    }, [pacientes, passageiros, searchQuery]);

    return {
        editingPacienteId,
        setEditingPacienteId,
        searchQuery,
        setSearchQuery,
        availablePacientes,
    };
}
