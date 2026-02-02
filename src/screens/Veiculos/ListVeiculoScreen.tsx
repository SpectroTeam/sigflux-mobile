import { useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { AVATAR_SIZES, BORDER_RADIUS, COLORS, SPACING } from "../../themes/tokens";
import { Header } from "../../components/common/Header";
import { SearchBar } from "../../components/common/SearchBar";
import { GenericCard } from "../../components/common/GenericCard";
import { CustomButton } from "../../components/common/CustomButton";
import { CustomModal } from "../../components/common/Modal";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Veiculo, VeiculoStackParamList } from "../../types";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useVeiculoMutations, useVeiculos } from "../../hooks/useVeiculos";

type Props = NativeStackScreenProps<VeiculoStackParamList, "ListVeiculos">;

export default function ListVeiculoSreen({ navigation }: Props) {
    const { data: veiculos = [], isLoading } = useVeiculos();
    const { deleteVeiculo } = useVeiculoMutations();
    const { showSnackbar } = useSnackbar();

    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVeiculo, setSelectedVeiculo] = useState({
        id: "",
        placa: "",
    });

    const filteredVeiculos = veiculos.filter(
        (veiculo) =>
            veiculo.placa.includes(searchQuery) || veiculo.chassi,
    );

    function handleNewVeiculo() {
        navigation.navigate("EditCreateVeiculo");
    }

    function handleVeiculoPress(veiculoId: string) {
        navigation.navigate("VeiculoDetails", { veiculoId });
    }

    function handleDeletePress(veiculo: Veiculo) {
        setSelectedVeiculo(() => ({
            id: veiculo.id,
            placa: veiculo.placa,
        }));
        setModalVisible(true);
    }

    async function confirmDeletePatient() {
        try {
            await deleteVeiculo.mutateAsync(selectedVeiculo.id);
            showSnackbar("Veículo excluído!", "success", "short")
            setModalVisible(false);
        } catch (error) {
            showSnackbar("Erro ao excluir veículo!", "error", "short")
        }
    }

    function handleEditVeiculo(veiculoId: string) {
        navigation.navigate("EditCreateVeiculo", { veiculoId });
    }

    return (
        <View style={styles.container}>
            <Header title="Veiculos" onBack={() => navigation.goBack()} />

            <View style={styles.content}>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Pesquisar..." />

                <CustomButton
                    size="small"
                    title="Novo veículo"
                    style={styles.button_style}
                    contentStyle={styles.button_padding}
                    labelStyle={styles.button_padding}
                    icon={() => (
                        <FontAwesome name="plus" size={16} color={COLORS.surface} style={{ marginRight: SPACING.sm }} />
                    )}
                    onPress={handleNewVeiculo}
                />

                {isLoading ? (
                    <View style={styles.loadContainer}>
                        <ActivityIndicator animating={true} color={COLORS.primary} size={AVATAR_SIZES.large} />
                    </View>
                ) : (
                    <FlatList
                        data={filteredVeiculos}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <GenericCard
                                fields={[
                                    { label: "Capacidade", value: item.capacidade.toString() },
                                    { label: "Status", value: item.status },
                                ]}
                                title={item.placa}
                                onPress={() => handleVeiculoPress(item.id)}
                                editButton={true}
                                trashButton={true}
                                editButtonAction={() => handleEditVeiculo(item.id)}
                                trashButtonAction={() => handleDeletePress(item)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>

            <CustomModal
                visible={modalVisible}
                message={`Tem certeza de que deseja excluir o veículo ${selectedVeiculo.placa}? Esta ação não pode ser desfeita.`}
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
                loading={deleteVeiculo.isPending}
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
