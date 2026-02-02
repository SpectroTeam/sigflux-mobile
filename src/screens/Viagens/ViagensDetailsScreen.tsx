import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ViagemStackParamList, ViagemStatus } from "../../types";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { AVATAR_SIZES, BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { Header } from "../../components/common/Header";
import LabelValue from "../../components/common/LabelValue";
import { List } from "react-native-paper";
import { useViagemById, useViagemMutations } from "../../hooks/useViagens";
import { formatDateBR } from "../../utils/masks";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { CustomButton } from "../../components/common/CustomButton";
import { CustomModal } from "../../components/common/Modal";

type Props = NativeStackScreenProps<ViagemStackParamList, "ViagemDetails">;

export default function ViagemDetailsScreen({ navigation, route }: Props) {
    const { viagemId } = route.params;
    const { viagem, isLoading } = useViagemById(viagemId);
    const { showSnackbar } = useSnackbar();
    const { iniciarViagem, concluirViagem } = useViagemMutations();

    const [confirmModalVisible, setCustomModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState<"iniciar" | "concluir" | null>(null);

    useEffect(() => {
        if (!isLoading && !viagem) {
            showSnackbar("Viagem não encontrada", "error", "default");
            navigation.goBack();
        }
    }, [viagem, isLoading, navigation, showSnackbar]);

    function handleEditViagem() {
        navigation.navigate("EditCreateViagens", { viagemId });
    }

    function handleIniciarViagem() {
        setModalAction("iniciar");
        setCustomModalVisible(true);
    }

    function handleConcluirViagem() {
        setModalAction("concluir");
        setCustomModalVisible(true);
    }

    function confirmAction() {
        if (modalAction === "iniciar") {
            iniciarViagem.mutate(viagemId, {
                onSuccess: () => {
                    showSnackbar("Viagem iniciada com sucesso!", "success", "default");
                    setCustomModalVisible(false);
                },
                onError: (error) => {
                    showSnackbar(
                        error instanceof Error ? error.message : "Erro ao iniciar viagem",
                        "error",
                        "default"
                    );
                },
            });
        } else if (modalAction === "concluir") {
            concluirViagem.mutate(viagemId, {
                onSuccess: () => {
                    showSnackbar("Viagem concluída com sucesso!", "success", "default");
                    setCustomModalVisible(false);
                },
                onError: (error) => {
                    showSnackbar(
                        error instanceof Error ? error.message : "Erro ao concluir viagem",
                        "error",
                        "default"
                    );
                },
            });
        }
    }

    const getStatusColor = (status: ViagemStatus) => {
        switch (status) {
            case "Planejada":
                return COLORS.info;
            case "Em andamento":
                return COLORS.warning;
            case "Concluída":
                return COLORS.success;
            case "Cancelada":
                return COLORS.error;
            default:
                return COLORS.text.primary;
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating color={COLORS.primary} size={AVATAR_SIZES.large} />
            </View>
        );
    }

    if (!viagem) return null;

    const canIniciar = viagem.status === "Planejada";
    const canConcluir = viagem.status === "Em andamento";
    const canEdit = viagem.status === "Planejada";
    const isActionLoading = iniciarViagem.isPending || concluirViagem.isPending;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Detalhes da Viagem" onBack={() => navigation.goBack()} />

            <View style={styles.container}>
                <View style={styles.upperRow}>
                    <Text style={styles.title}>Dados da viagem</Text>
                    {canEdit && (
                        <CustomButton
                            mode="contained-tonal"
                            variant="outline"
                            fullWidth={false}
                            icon={() => <Feather name="edit" size={20} color={COLORS.success} />}
                            labelStyle={styles.button_label_style}
                            size="small"
                            style={{ left: SPACING.md, top: SPACING.xs }}
                            contentStyle={{ paddingHorizontal: 0 }}
                            onPress={handleEditViagem}
                            title="Editar"
                        />
                    )}
                </View>

                <View style={styles.textContainer}>
                    <LabelValue label="Tipo: " value={viagem.tipo} />
                    <LabelValue label="Destino: " value={viagem.enderecoDestino} />
                    <LabelValue label="Data e hora: " value={formatDateBR(viagem.dataHora)} />
                    <LabelValue
                        label="Veículo: "
                        value={`${viagem.veiculo[0]?.modelo} - ${viagem.veiculo[0]?.placa}`}
                    />
                    <LabelValue
                        label="Motorista: "
                        value={`${viagem.motorista[0]?.nomeCompleto} - ${viagem.motorista[0]?.matricula}`}
                    />
                    <View style={styles.statusRow}>
                        <Text style={styles.label}>Status: </Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(viagem.status) }]}>
                            <Text style={styles.statusText}>{viagem.status}</Text>
                        </View>
                    </View>
                </View>

                <List.Section style={styles.listSection}>
                    <List.Item
                        title="Passageiros"
                        description={`${viagem.passageiros.length} passageiro(s)`}
                        left={(props) => <List.Icon {...props} icon="account-multiple-outline" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate("ViagemPassageiros", { viagemId })}
                        style={styles.listItem}
                        titleStyle={styles.listItemTitle}
                    />

                    <List.Item
                        title="Paradas"
                        description={`${viagem.paradas.length} parada(s)`}
                        left={(props) => <List.Icon {...props} icon="map-marker-multiple-outline" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate("ViagemParadas", { viagemId })}
                        style={styles.listItem}
                        titleStyle={styles.listItemTitle}
                    />
                </List.Section>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    {canIniciar && (
                        <CustomButton
                            mode="contained"
                            variant="primary"
                            fullWidth
                            icon={() => (
                                <MaterialCommunityIcons
                                    name="play-circle"
                                    size={24}
                                    color={COLORS.white}
                                />
                            )}
                            onPress={handleIniciarViagem}
                            title="Iniciar Viagem"
                            loading={isActionLoading}
                            disabled={isActionLoading}
                        />
                    )}
                    {canConcluir && (
                        <CustomButton
                            mode="contained"
                            variant="success"
                            fullWidth
                            icon={() => (
                                <MaterialCommunityIcons
                                    name="check-circle"
                                    size={24}
                                    color={COLORS.white}
                                />
                            )}
                            onPress={handleConcluirViagem}
                            title="Concluir Viagem"
                            loading={isActionLoading}
                            disabled={isActionLoading}
                        />
                    )}
                    {viagem.status === "Concluída" && (
                        <View style={styles.completedMessage}>
                            <MaterialCommunityIcons
                                name="check-decagram"
                                size={24}
                                color={COLORS.success}
                            />
                            <Text style={styles.completedText}>Esta viagem foi concluída</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Confirmation Modal */}
            <CustomModal
                visible={confirmModalVisible}
                onCancel={() => setCustomModalVisible(false)}
                title={modalAction === "iniciar" ? "Iniciar Viagem" : "Concluir Viagem"}
                confirmText={modalAction === "iniciar" ? "Iniciar" : "Concluir"}
                cancelText="Cancelar"
                onConfirm={confirmAction}
            >
                <Text style={styles.modalText}>
                    {modalAction === "iniciar"
                        ? "Tem certeza que deseja iniciar esta viagem? O status será alterado para 'Em andamento' e o veículo será marcado como indisponível."
                        : "Tem certeza que deseja concluir esta viagem? O status será alterado para 'Concluída' e o histórico dos passageiros será atualizado."}
                </Text>
            </CustomModal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        gap: SPACING.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        gap: SPACING.md,
    },
    title: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xl + 2,
        alignSelf: "flex-start",
    },
    listSection: {
        padding: 0,
        margin: 0,
        gap: SPACING.xs,
    },
    listItem: {
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.xs,
        width: "100%",
        backgroundColor: COLORS.surface,
        paddingHorizontal: 0,
    },
    listItemTitle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
    },
    upperRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "center",
    },
    button_label_style: {
        fontFamily: "Josefin Sans",
        alignSelf: "flex-end",
        fontSize: FONT_SIZES.lg,
        color: COLORS.success,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs / 2,
        borderRadius: BORDER_RADIUS.sm,
    },
    statusText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.sm,
        color: COLORS.white,
    },
    actionButtonsContainer: {
        marginTop: SPACING.md,
        gap: SPACING.md,
    },
    completedMessage: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: SPACING.sm,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
    },
    completedText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        color: COLORS.success,
    },
    modalText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        color: COLORS.text.light,
        textAlign: "center",
        lineHeight: 22,
    },
});
