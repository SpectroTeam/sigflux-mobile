import { FlatList, View, Text, StyleSheet, Alert } from "react-native";
import { Header } from "../../components/common/Header";
import { PassengerCard } from "../../components/Viagem/PassengerCard";
import { SearchBar } from "../../components/common/SearchBar";
import { AvailablePacienteCard } from "../../components/Viagem/AvailablePacienteCard";
import { FooterSegmented } from "../../components/common/FooterSegmented";
import React, { useState, useEffect, useMemo } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useViagemById } from "../../hooks/useViagens";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../themes/tokens";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ViagemStackParamList, PacienteViagem } from "../../types";
import { useViagemPassageiros } from "../../hooks/useViagemPassageiros";
import { VIAGEM_STATUS } from "../../constants";

type Props = NativeStackScreenProps<ViagemStackParamList, "ViagemPassageiros">;

// Função para calcular ocupação (pacientes + acompanhantes)
function calcularOcupacao(passageiros: PacienteViagem[]): number {
    return passageiros.reduce((total, p) => {
        return total + 1 + (p.acompanhante ? 1 : 0);
    }, 0);
}

export default function ViagemPassageirosScreen({ navigation, route }: Props) {
    const { viagemId } = route.params;
    const { viagem, isLoading: viagemLoading } = useViagemById(viagemId);
    const { showSnackbar } = useSnackbar();
    const [viewMode, setViewMode] = useState<"listar" | "adicionar">("listar");

    useEffect(() => {
        if (!viagemLoading && !viagem) {
            showSnackbar("Viagem não encontrada", "error", "default");
            navigation.goBack();
        }
    }, [viagem, viagemLoading]);

    if (viagemLoading) return <Text>loading</Text>;
    if (!viagem) return null;

    const isViagemConcluida = viagem.status === VIAGEM_STATUS.CONCLUIDA;

    const { 
        editingPacienteId, 
        setEditingPacienteId, 
        searchQuery, 
        setSearchQuery, 
        availablePacientes,
        addPaciente,
        removePaciente,
        updateAcompanhante,
        isLoading: operationsLoading
    } = useViagemPassageiros({
        passageiros: viagem.passageiros,
        viagemId,
    });

    // Calcular capacidade
    const capacidadeVeiculo = viagem.veiculo[0]?.capacidade || 7;
    const ocupacaoAtual = calcularOcupacao(viagem.passageiros);
    const lugaresDisponiveis = capacidadeVeiculo - ocupacaoAtual;

    return (
        <View style={styles.screen}>
            <Header title="Passageiros da Viagem" onBack={navigation.goBack} />

            <View style={styles.container}>
                <Text style={styles.subtitle}>Viagem para {viagem.enderecoDestino}</Text>
                
                {/* Info de capacidade */}
                <View style={styles.capacityContainer}>
                    <Text style={styles.capacityText}>
                        Ocupação: {ocupacaoAtual}/{capacidadeVeiculo} lugares
                    </Text>
                    <Text style={[
                        styles.capacityAvailable,
                        lugaresDisponiveis <= 2 && styles.capacityWarning,
                        lugaresDisponiveis === 0 && styles.capacityFull
                    ]}>
                        {lugaresDisponiveis > 0 
                            ? `${lugaresDisponiveis} lugar(es) disponível(is)` 
                            : "Veículo lotado"}
                    </Text>
                </View>

                {isViagemConcluida && (
                    <View style={styles.warningContainer}>
                        <Text style={styles.warningText}>
                            Esta viagem foi concluída. Não é possível adicionar ou remover passageiros.
                        </Text>
                    </View>
                )}

                {viewMode === "listar" ? (
                    <FlatList
                        data={viagem.passageiros}
                        keyExtractor={(item) => item.paciente.id}
                        renderItem={({ item }) => (
                            <PassengerCard
                                passageiro={item}
                                isEditing={editingPacienteId === item.paciente.id}
                                onEdit={() => !isViagemConcluida && setEditingPacienteId(item.paciente.id)}
                                onSave={async (acompanhanteId) => {
                                    try {
                                        await updateAcompanhante({ 
                                            pacienteId: item.paciente.id, 
                                            acompanhanteId 
                                        });
                                        setEditingPacienteId(null);
                                        showSnackbar("Acompanhante atualizado com sucesso", "success", "default");
                                    } catch (error: any) {
                                        showSnackbar(error.message || "Erro ao atualizar acompanhante", "error", "default");
                                    }
                                }}
                                onRemove={() => {
                                    if (isViagemConcluida) {
                                        showSnackbar("Não é possível remover passageiros de uma viagem concluída", "error", "default");
                                        return;
                                    }
                                    Alert.alert(
                                        "Confirmar Remoção",
                                        "Deseja remover este paciente da viagem?",
                                        [
                                            { text: "Cancelar", style: "cancel" },
                                            {
                                                text: "Remover",
                                                style: "destructive",
                                                onPress: async () => {
                                                    try {
                                                        await removePaciente(item.paciente.id);
                                                        showSnackbar("Paciente removido com sucesso", "success", "default");
                                                    } catch (error: any) {
                                                        showSnackbar(error.message || "Erro ao remover paciente", "error", "default");
                                                    }
                                                },
                                            },
                                        ]
                                    );
                                }}
                                disabled={isViagemConcluida}
                            />
                        )}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Nenhum passageiro adicionado</Text>
                        }
                    />
                ) : (
                    <>
                        <SearchBar
                            placeholder="Buscar paciente..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            containerStyle={styles.searchBar}
                        />
                        {lugaresDisponiveis === 0 ? (
                            <Text style={styles.emptyText}>
                                Não há lugares disponíveis no veículo
                            </Text>
                        ) : (
                            <FlatList
                                data={availablePacientes}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <AvailablePacienteCard 
                                        paciente={item}
                                        lugaresDisponiveis={lugaresDisponiveis}
                                        onAdd={async (pacienteId, acompanhanteId) => {
                                            try {
                                                await addPaciente({ pacienteId, acompanhanteId });
                                                showSnackbar("Paciente adicionado com sucesso", "success", "default");
                                            } catch (error: any) {
                                                showSnackbar(error.message || "Erro ao adicionar paciente", "error", "default");
                                            }
                                        }} 
                                    />
                                )}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>
                                        Nenhum paciente disponível encontrado
                                    </Text>
                                }
                            />
                        )}
                    </>
                )}
            </View>

            {!isViagemConcluida && (
                <FooterSegmented value={viewMode} onChange={setViewMode} />
            )}
        </View>
    );
}

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    container: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
    },

    subtitle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
        color: COLORS.text.primary,
        textAlign: "center",
        marginBottom: SPACING.sm,
    },

    searchBar: {
        marginBottom: SPACING.md,
    },

    capacityContainer: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.md,
        alignItems: "center",
    },

    capacityText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
    },

    capacityAvailable: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.sm,
        color: COLORS.success,
        marginTop: SPACING.xs,
    },

    capacityWarning: {
        color: COLORS.warning || "#FFA500",
    },

    capacityFull: {
        color: COLORS.error,
    },

    warningContainer: {
        backgroundColor: COLORS.error + "20",
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.md,
    },

    warningText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        textAlign: "center",
    },

    emptyText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
        textAlign: "center",
        marginTop: SPACING.xl,
        fontStyle: "italic",
    },
});
