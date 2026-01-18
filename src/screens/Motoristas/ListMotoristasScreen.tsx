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

import { Motorista } from "../../types";
import { useMotoristas } from "../../hooks/useMotoristas";
import * as motoristaService from "../../services/motorista_service";
import { useSnackbar } from "../../contexts/SnackBarContext";

type MotoristaStackParamList = {
    ListMotoristas: undefined;
    EditCreateMotorista: { motoristaId?: string } | undefined;
};

type Props = NativeStackScreenProps<MotoristaStackParamList, "ListMotoristas">;

export default function ListMotoristasScreen({ navigation }: Props) {
    const { motoristas, loading, reload } = useMotoristas();
    const { showSnackbar } = useSnackbar();

    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMotorista, setSelectedMotorista] = useState({
        id: "",
        nome: "",
    });

    const filteredMotoristas = motoristas.filter((m) =>
        m.nome.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    function handleNewMotorista() {
        navigation.navigate("EditCreateMotorista");
    }

    function handleDeletePress(motorista: Motorista) {
        setSelectedMotorista({ id: motorista.id, nome: motorista.nome });
        setModalVisible(true);
    }

    async function confirmDeleteMotorista() {
        try {
            await motoristaService.deleteById(selectedMotorista.id);
            showSnackbar("Motorista excluído!", "success", "short");
            setModalVisible(false);
            reload();
        } catch (error) {
            showSnackbar("Erro ao excluir motorista!", "error", "short");
        }
    }

    function handleEditMotorista(motoristaId: string) {
        navigation.navigate("EditCreateMotorista", { motoristaId });
    }

    return (
        <View style={styles.container}>
            <Header title="Motoristas" onBack={() => navigation.goBack()} />

            <View style={styles.content}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Pesquisar..."
                />

                <CustomButton
                    size="small"
                    title="Novo motorista"
                    style={styles.button_style}
                    contentStyle={styles.button_padding}
                    labelStyle={styles.button_padding}
                    icon={() => (
                        <FontAwesome
                            name="plus"
                            size={16}
                            color={COLORS.surface}
                            style={{ marginRight: SPACING.sm }}
                        />
                    )}
                    onPress={handleNewMotorista}
                />

                {loading ? (
                    <View style={styles.loadContainer}>
                        <ActivityIndicator
                            animating={true}
                            color={COLORS.primary}
                            size={AVATAR_SIZES.large}
                        />
                    </View>
                ) : (
                    <FlatList
                        data={filteredMotoristas}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <GenericCard
                                title={item.nome}
                                fields={[
                                    { label: "Matrícula", value: item.matricula },
                                ]}
                                editButton
                                trashButton
                                editButtonAction={() => handleEditMotorista(item.id)}
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
                message={`Tem certeza de que deseja excluir o motorista ${selectedMotorista.nome}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                icon={() => (
                    <MaterialCommunityIcons
                        name="alert-decagram-outline"
                        size={AVATAR_SIZES.lg - 8}
                        style={{ color: COLORS.error }}
                    />
                )}
                onConfirm={confirmDeleteMotorista}
                onCancel={() => setModalVisible(false)}
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
