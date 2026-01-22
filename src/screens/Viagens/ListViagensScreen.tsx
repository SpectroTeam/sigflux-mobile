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
import { Viagem, ViagemStackParamList } from "../../types";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useViagem, useViagemMutations } from "../../hooks/useViagens";

type Props = NativeStackScreenProps<ViagemStackParamList, "ListViagens">;

export default function ListViagemSreen({ navigation }: Props) {
    const { data: viagens = [], isLoading } = useViagem();
    const { deleteViagem } = useViagemMutations();
    const { showSnackbar } = useSnackbar();

    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedViagem, setSelectedViagem] = useState({
        id: "",
        cidade_destino: "",
        data_hora: new Date()
    });

    const filteredViagens = viagens.filter(
        (viagem) =>
            viagem.cidade_destino.includes(searchQuery) || viagem.id,
    );

    function handleNewViagem() {
        navigation.navigate("EditCreateViagens");
    }

    function handleViagemPress(viagemId: string) {
        navigation.navigate("ViagemDetails", { viagemId });
    }

    function handleDeletePress(viagem: Viagem) {
        setSelectedViagem(() => ({
            id: viagem.id,
            cidade_destino: viagem.cidade_destino,
            data_hora: new Date(),
        }));
        setModalVisible(true);
    }

    async function confirmDeleteViagem() {
        try {
            await deleteViagem.mutateAsync(selectedViagem.id);
            showSnackbar("Viagem excluída!", "success", "short")
            setModalVisible(false);
        } catch (error) {
            showSnackbar("Erro ao excluir viagem!", "error", "short")
        }
    }

    function handleEditViagem(viagemId: string) {
        navigation.navigate("EditCreateViagens", { viagemId });
    }

    return (
        <View style={styles.container}>
            <Header title="Viagens" onBack={() => navigation.goBack()} />

            <View style={styles.content}>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Pesquisar..." />

                <CustomButton
                    size="small"
                    title="Nova viagem"
                    style={styles.button_style}
                    contentStyle={styles.button_padding}
                    labelStyle={styles.button_padding}
                    icon={() => (
                        <FontAwesome name="plus" size={16} color={COLORS.surface} style={{ marginRight: SPACING.sm }} />
                    )}
                    onPress={handleNewViagem}
                />

                {isLoading ? (
                    <View style={styles.loadContainer}>
                        <ActivityIndicator animating={true} color={COLORS.primary} size={AVATAR_SIZES.large} />
                    </View>
                ) : (
                    <FlatList
                        data={filteredViagens}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <GenericCard
                                fields={[
                                    {
                                        label: "Data",
                                        value: new Date(item.data_hora).toLocaleDateString("pt-BR"),
                                    },
                                    { label: "Status", value: item.status },
                                ]}
                                title={item.cidade_destino}
                                onPress={() => handleViagemPress(item.id)}
                                editButton={true}
                                trashButton={true}
                                editButtonAction={() => handleEditViagem(item.id)}
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
                message={`Tem certeza de que deseja excluir a viagem ${selectedViagem.cidade_destino} - ${selectedViagem.data_hora}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                icon={() => (
                    <MaterialCommunityIcons
                        name="alert-decagram-outline"
                        size={AVATAR_SIZES.lg - 8}
                        style={{ color: COLORS.error }}
                    />
                )}
                onConfirm={confirmDeleteViagem}
                onCancel={() => setModalVisible(false)}
                loading={deleteViagem.isPending}
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
