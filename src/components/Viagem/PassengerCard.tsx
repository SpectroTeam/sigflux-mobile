import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../themes/tokens";
import { PacienteViagem } from "../../types";
import { GenericCardTest } from "../common/GenericCardTest";
import { AcompanhanteDropdown } from "./AcompanhanteDropdown";
import { useState } from "react";

type PassengerCardProps = {
    passageiro: PacienteViagem;
    isEditing: boolean;
    onEdit(): void;
    onSave(acompanhanteId?: string): void;
    onRemove(): void;
    disabled?: boolean;
};

export function PassengerCard({ passageiro, isEditing, onEdit, onSave, onRemove, disabled = false }: PassengerCardProps) {
    const [selectedAcompanhanteId, setSelectedAcompanhanteId] = useState<string>(
        passageiro.acompanhante?.id || ""
    );

    const fields = [
        { label: "CPF", value: passageiro.paciente.cpf },
    ];

    if (!isEditing && passageiro.acompanhante) {
        fields.push({
            label: "Acompanhante",
            value: `${passageiro.acompanhante.nome} (${passageiro.acompanhante.parentesco})`,
        });
    }

    const handleSave = () => {
        onSave(selectedAcompanhanteId || undefined);
    };

    return (
        <GenericCardTest
            title={passageiro.paciente.nome}
            fields={fields}
            primaryButton={!disabled ? {
                title: isEditing ? "Salvar" : "Editar",
                icon: () => <Feather name="edit" size={20} color={COLORS.success} />,
                action: isEditing ? handleSave : onEdit,
            } : undefined}
            secondaryButton={!disabled ? {
                title: "Remover",
                icon: () => <Feather name="trash-2" size={20} color={COLORS.error} />,
                action: onRemove,
            } : undefined}
        >
            {isEditing && !disabled && (
                <AcompanhanteDropdown
                    value={selectedAcompanhanteId}
                    onSelect={setSelectedAcompanhanteId}
                    pacienteId={passageiro.paciente.id}
                />
            )}
        </GenericCardTest>
    );
}
