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

import { CasaApoio } from "../../types";
import { useCasasApoio } from "../../hooks/useCasasApoio";
import * as casaApoioService from "../../services/casa_apoio_service";
import { useSnackbar } from "../../contexts/SnackBarContext";

type CasaApoioStackParamList = {
    ListCasasApoio: undefined;
    EditCreateCasaApoio: { casaApoioId?: string } | undefined;
};

type Props = NativeStackScreenProps<CasaApoioStackParamList, "ListCasasApoio">;

export default function ListCasasApoioScreen({ navigation }: Props) {
    const { casasApoio, loading, reload } = useCasasApoio();
    const { showSnackbar } = useSnackbar();

    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCasa, setSelectedCasa] = useState({
        id: "",
        nome: "",
    });

    const filteredCasas = casasApoio.filter((casa) =>
        casa.nome.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    function handleNewCasaApoio() {
        navigation.navigate("EditCreateCasaApoio", { casaApoioId: undefined });
    }

    function handleDeletePress(casa: CasaApoio) {
        setSelectedCasa({ id: casa.id, nome: casa.nome });
        setModalVisible(true);
    }

    async function confirmDeleteCasa() {
        try {
            await casaApoioService.deleteById(selectedCasa.id);
            showSnackbar("Casa de apoio excluída!", "success", "short");
            setModalVisible(false);
            reload();
        } catch (error) {
            showSnackbar("Erro ao excluir casa de apoio!", "error", "short");
        }
    }

    function handleEditCasa(casaApoioId: string) {
        navigation.navigate("EditCreateCasaApoio", { casaApoioId });
    }

    return (
        <View style={styles.container}>
            <Header title="Casas de Apoio" onBack={() => navigation.goBack()} />

            <View style={styles.content}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Pesquisar..."
                />

                <CustomButton
                    size="small"
                    title="Nova casa de apoio"
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
                    onPress={handleNewCasaApoio}
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
                        data={filteredCasas}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <GenericCard
                                title={item.nome}
                                fields={[
                                    { label: "Endereço", value: item.endereco },
                                    {
                                        label: "Lotação",
                                        value: `${item.lotacaoAtual} / ${item.capacidadeMaxima}`,
                                    },
                                ]}
                                editButton
                                trashButton
                                editButtonAction={() => handleEditCasa(item.id)}
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
                message={`Tem certeza de que deseja excluir a casa de apoio ${selectedCasa.nome}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                icon={() => (
                    <MaterialCommunityIcons
                        name="alert-decagram-outline"
                        size={AVATAR_SIZES.lg - 8}
                        style={{ color: COLORS.error }}
                    />
                )}
                onConfirm={confirmDeleteCasa}
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
