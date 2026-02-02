import { Paciente } from "../../types";
import { GenericCardTest } from "../common/GenericCardTest";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { AcompanhanteDropdown } from "./AcompanhanteDropdown";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

type Props = {
    paciente: Paciente;
    lugaresDisponiveis: number;
    onAdd(pacienteId: string, acompanhanteId?: string): void;
};

export function AvailablePacienteCard({ paciente, lugaresDisponiveis, onAdd }: Props) {
    const [selectedAcompanhanteId, setSelectedAcompanhanteId] = useState<string>("");

    const hasAcompanhantes = paciente.acompanhantes && paciente.acompanhantes.length > 0;
    const canAddWithAcompanhante = lugaresDisponiveis >= 2;

    const handleAdd = () => {
        // Se selecionou acompanhante mas não tem lugares suficientes
        if (selectedAcompanhanteId && !canAddWithAcompanhante) {
            return;
        }
        onAdd(paciente.id, selectedAcompanhanteId || undefined);
    };

    // Resetar seleção de acompanhante se não houver lugares suficientes
    const handleAcompanhanteSelect = (value: string) => {
        if (value && !canAddWithAcompanhante) {
            return; // Não permitir selecionar acompanhante se não houver espaço
        }
        setSelectedAcompanhanteId(value);
    };

    return (
        <GenericCardTest
            title={paciente.nome}
            fields={[{ label: "CPF", value: paciente.cpf }]}
            primaryButton={{
                title: "Adicionar",
                icon: () => <Feather name="plus" size={20} color={COLORS.success} />,
                action: handleAdd,
            }}
        >
            {hasAcompanhantes && (
                <View>
                    <AcompanhanteDropdown
                        value={selectedAcompanhanteId}
                        onSelect={handleAcompanhanteSelect}
                        pacienteId={paciente.id}
                    />
                    {!canAddWithAcompanhante && (
                        <Text style={styles.warningText}>
                            Apenas 1 lugar disponível - não é possível adicionar com acompanhante
                        </Text>
                    )}
                </View>
            )}
        </GenericCardTest>
    );
}

const styles = StyleSheet.create({
    warningText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
});
