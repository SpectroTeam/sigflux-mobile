import { View, FlatList, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { GenericCard } from "../../components/common/GenericCard";
import { Header } from "../../components/common/Header";
import { SPACING, COLORS, FONT_SIZES, BORDER_RADIUS, AVATAR_SIZES } from "../../themes/tokens";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CustomButton } from "../../components/common/CustomButton";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { ConfirmModal } from "../../components/common/Modal";
import { useEffect, useState } from "react";
import { Acompanhante, PacienteStackParamList } from "../../types";
import { usePacienteByIndex, usePacienteMutations } from "../../hooks/usePacientes";

type Props = NativeStackScreenProps<PacienteStackParamList, "ListAcompanhantes">;

export default function ListAcompanhantesScreen({ navigation, route }: Props) {
    const { pacienteIndex } = route.params;
    const { data: paciente, isLoading } = usePacienteByIndex(pacienteIndex);
    const { deleteAcompanhante } = usePacienteMutations();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAcompanhante, setSelectedAcompanhante] = useState({ id: "", nome: "" });

    useEffect(() => {
        if (!isLoading && !paciente) {
            navigation.goBack();
        }
    }, [paciente, isLoading, navigation]);

    async function confirmDeleteAcompanhante() {
        try {
            await deleteAcompanhante.mutateAsync({
                pacienteId: paciente!.id,
                acompanhanteId: selectedAcompanhante.id,
            });

            Alert.alert("Sucesso", "Acompanhante excluído com sucesso.");
            setModalVisible(false);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o acompanhante. Tente novamente.");
        }
    }

    function handleDeletePress(paciente: Acompanhante) {
        setSelectedAcompanhante(() => ({
            id: paciente.id,
            nome: paciente.nome,
        }));
        setModalVisible(true);
    }

    function handleNewAcompanhante() {
        Alert.alert("TO-do", "new acompanhante");
    }

    function handleEditAcompanhante(acompanhante: Acompanhante) {
        Alert.alert("TO-do", "edit acompanhante");
    }

    if (isLoading) {
        return <ActivityIndicator animating={true} color={COLORS.primary} size={AVATAR_SIZES.large} />;
    }

    if (!paciente) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Acompanhantes" onBack={() => navigation.goBack()} />

            <View style={{ flex: 1, paddingHorizontal: SPACING.xl }}>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{paciente.nome}</Text>
                    <Text style={styles.subtitle}>CPF: {paciente.cpf}</Text>
                </View>

                <CustomButton
                    size="small"
                    title="Adicionar"
                    style={styles.button_style}
                    contentStyle={styles.button_padding}
                    labelStyle={styles.button_padding}
                    icon={() => (
                        <FontAwesome name="plus" size={16} color={COLORS.surface} style={{ marginRight: SPACING.sm }} />
                    )}
                    onPress={handleNewAcompanhante}
                />

                <FlatList
                    data={paciente.acompanhantes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ index, item }) => (
                        <GenericCard
                            title={item.nome}
                            fields={[
                                { label: "CPF", value: item.cpf },
                                { label: "Telefone", value: item.telefone },
                                { label: "Parentesco", value: item.parentesco },
                            ]}
                            editButton={true}
                            trashButton={true}
                            trashButtonAction={() => handleDeletePress(item)}
                            editButtonAction={() => handleEditAcompanhante(item)} 
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum Acompanhante Registrado</Text>
                        </View>
                    }
                />
            </View>

            <ConfirmModal
                visible={modalVisible}
                message={`Tem certeza de que deseja excluir o acompanhante ${selectedAcompanhante.nome}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                icon={() => (
                    <MaterialCommunityIcons
                        name="alert-decagram-outline"
                        size={AVATAR_SIZES.lg - 8}
                        style={{ color: COLORS.error }}
                    />
                )}
                onConfirm={confirmDeleteAcompanhante}
                onCancel={() => setModalVisible(false)}
                confirmColor={COLORS.error}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerInfo: {
        backgroundColor: COLORS.background,
        paddingBottom: SPACING.sm,
    },
    listContent: {},
    title: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xl - 2,
    },
    subtitle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: SPACING.xxl,
    },
    emptyText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.xl,
        textAlign: "center",
    },
    button_style: {
        alignSelf: "flex-end",
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: 0,
        backgroundColor: COLORS.success,
        marginBottom: SPACING.sm,
    },
    button_padding: {
        paddingHorizontal: 0,
    },
});
