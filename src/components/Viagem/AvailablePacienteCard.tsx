import { Paciente } from "../../types";
import { GenericCardTest } from "../common/GenericCardTest";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../themes/tokens";
import { AcompanhanteDropdown } from "./AcompanhanteDropdown";

type Props = {
    paciente: Paciente;
    onAdd(): void;
};

export function AvailablePacienteCard({ paciente, onAdd }: Props) {
    return (
        <GenericCardTest
            title={paciente.nome}
            fields={[{ label: "CPF", value: paciente.cpf }]}
            primaryButton={{
                title: "Adicionar",
                icon: () => <Feather name="plus" size={20} color={COLORS.success} />,
                action: onAdd,
            }}
        >
            <AcompanhanteDropdown />
        </GenericCardTest>
    );
}
