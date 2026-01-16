import { useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { AVATAR_SIZES, BORDER_RADIUS, COLORS, SPACING } from "../../themes/tokens";
import { Header } from "../../components/common/Header";
import { SearchBar } from "../../components/common/SearchBar";
import { GenericCard } from "../../components/common/GenericCard";
import { CustomButton } from "../../components/common/CustomButton";
import { ConfirmModal } from "../../components/common/Modal";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Paciente, PacienteStackParamList } from "../../types";
import { usePacienteMutations, usePacientes } from "../../hooks/usePacientes";
import { useSnackbar } from "../../contexts/SnackBarContext";

type Props = NativeStackScreenProps<PacienteStackParamList, "ListPacientes">;

export default function ListPacientesSreen({ navigation }: Props) {
    const { data: pacientes = [], isLoading } = usePacientes();
    const { deletePaciente } = usePacienteMutations();
    const { showSnackbar } = useSnackbar();

    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState({
        id: "",
        nome: "",
    });

    const filteredPatients = pacientes.filter(
        (paciente) =>
            paciente.nome.toLowerCase().includes(searchQuery.toLowerCase()) || paciente.cpf.includes(searchQuery),
    );

    function handleNewPaciente() {
        navigation.navigate("EditCreatePaciente");
    }

    function handlePacientePress(pacienteId: string) {
        navigation.navigate("PacienteDetails", { pacienteId });
    }

    function handleDeletePress(paciente: Paciente) {
        setSelectedPatient(() => ({
            id: paciente.id,
            nome: paciente.nome,
        }));
        setModalVisible(true);
    }

    async function confirmDeletePatient() {
        try {
            await deletePaciente.mutateAsync(selectedPatient.id);
            showSnackbar("Paciente excluído!", "success", "short")
            setModalVisible(false);
        } catch (error) {
            showSnackbar("Erro ao excluir paciente!", "error", "short")
        }
    }

    function handleEditPatient(pacienteId: string) {
        navigation.navigate("EditCreatePaciente", { pacienteId });
    }

    return (
        <View style={styles.container}>
            <Header title="Pacientes" onBack={() => navigation.goBack()} />

            <View style={styles.content}>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Pesquisar..." />

                <CustomButton
                    size="small"
                    title="Novo paciente"
                    style={styles.button_style}
                    contentStyle={styles.button_padding}
                    labelStyle={styles.button_padding}
                    icon={() => (
                        <FontAwesome name="plus" size={16} color={COLORS.surface} style={{ marginRight: SPACING.sm }} />
                    )}
                    onPress={handleNewPaciente}
                />

                {isLoading ? (
                    <View style={styles.loadContainer}>
                        <ActivityIndicator animating={true} color={COLORS.primary} size={AVATAR_SIZES.large} />
                    </View>
                ) : (
                    <FlatList
                        data={filteredPatients}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <GenericCard
                                fields={[
                                    { label: "CPF", value: item.cpf },
                                    { label: "Status", value: item.status },
                                ]}
                                title={item.nome}
                                onPress={() => handlePacientePress(item.id)}
                                editButton={true}
                                trashButton={true}
                                editButtonAction={() => handleEditPatient(item.id)}
                                trashButtonAction={() => handleDeletePress(item)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>

            <ConfirmModal
                visible={modalVisible}
                message={`Tem certeza de que deseja excluir o paciente ${selectedPatient.nome}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                icon={() => (
                    <MaterialCommunityIcons
                        name="alert-decagram-outline"
                        size={AVATAR_SIZES.lg - 8}
                        style={{ color: COLORS.error }}
                    />
                )}
                onConfirm={confirmDeletePatient}
                onCancel={() => setModalVisible(false)}
                loading={deletePaciente.isPending}
                confirmColor={COLORS.error}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.md,
        gap: SPACING.md,
    },
    listContent: {
        paddingBottom: SPACING.xl,
    },
    loadContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button_style: {
        alignSelf: "flex-end",
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: 0,
        backgroundColor: COLORS.success,
    },
    button_padding: {
        paddingHorizontal: 0,
    },
});
