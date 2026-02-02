import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../themes/tokens";
import { Paciente } from "../../types";
import { GenericCardTest } from "../common/GenericCardTest";
import { AcompanhanteDropdown } from "./AcompanhanteDropdown";

type PassengerCardProps = {
    paciente: Paciente;
    isEditing: boolean;
    onEdit(): void;
    onSave(): void;
    onRemove(): void;
};

export function PassengerCard({ paciente, isEditing, onEdit, onSave, onRemove }: PassengerCardProps) {
    const fields = [
        { label: "CPF", value: paciente.cpf },
        !isEditing && { label: "Acompanhante", value: "Jose Mari Marin" },
    ].filter(Boolean);

    return (
        <GenericCardTest
            title={paciente.nome}
            fields={fields}
            primaryButton={{
                title: isEditing ? "Salvar" : "Editar",
                icon: () => <Feather name="edit" size={20} color={COLORS.success} />,
                action: isEditing ? onSave : onEdit,
            }}
            secondaryButton={{
                title: "Remover",
                icon: () => <Feather name="trash-2" size={20} color={COLORS.error} />,
                action: onRemove,
            }}
        >
            {isEditing && <AcompanhanteDropdown />}
        </GenericCardTest>
    );
}
