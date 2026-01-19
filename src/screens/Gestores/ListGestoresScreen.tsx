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
import { User, UserStackParamList} from "../../types";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useUsuario, useUsuarioMutations } from "../../hooks/useGestores";

type Props = NativeStackScreenProps<UserStackParamList, "ListGestores">;

export default function ListGestoresScreen({ navigation }: Props) {
    const { data: usuarios = [], isLoading } = useUsuario();
    const { deleteUsuario } = useUsuarioMutations();
    const { showSnackbar } = useSnackbar();

    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState({
        id: "",
        nome: "",
    });

    const filteredUsuarios = usuarios.filter(
        (usuario) =>
            usuario.nome_completo.toLowerCase().includes(searchQuery.toLowerCase()) || usuario.cpf.includes(searchQuery),
    );

    function handleNewGestor() {
        navigation.navigate("EditCreateGestor");
    }

    function handleGestorPress(gestorId: string) {
        navigation.navigate("GestorDetails", { gestorId });
    }

    function handleDeletePress(usuario: User) {
        setSelectedUsuario(() => ({
            id: usuario.id,
            nome: usuario.nome_completo,
        }));
        setModalVisible(true);
    }

    async function confirmDeleteUsuario() {
        try {
            await deleteUsuario.mutateAsync(selectedUsuario.id);
            showSnackbar("Gestor excluído!", "success", "short")
            setModalVisible(false);
        } catch (error) {
            showSnackbar("Erro ao excluir gestor!", "error", "short")
        }
    }

    function handleEditGestor(gestorId: string) {
        navigation.navigate("EditCreateGestor", { gestorId });
    }

    return (
        <View style={styles.container}>
            <Header title="Gestores" onBack={() => navigation.goBack()} />

            <View style={styles.content}>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Pesquisar..." />

                <CustomButton
                    size="small"
                    title="Novo gestor"
                    style={styles.button_style}
                    contentStyle={styles.button_padding}
                    labelStyle={styles.button_padding}
                    icon={() => (
                        <FontAwesome name="plus" size={16} color={COLORS.surface} style={{ marginRight: SPACING.sm }} />
                    )}
                    onPress={handleNewGestor}
                />

                {isLoading ? (
                    <View style={styles.loadContainer}>
                        <ActivityIndicator animating={true} color={COLORS.primary} size={AVATAR_SIZES.large} />
                    </View>
                ) : (
                    <FlatList
                        data={filteredUsuarios}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <GenericCard
                                fields={[
                                    { label: "CPF", value: item.cpf },
                                    { label: "Matrícula", value: item.matricula },
                                ]}
                                title={item.nome_completo}
                                onPress={() => handleGestorPress(item.id)}
                                editButton={true}
                                trashButton={true}
                                editButtonAction={() => handleEditGestor(item.id)}
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
                message={`Tem certeza de que deseja excluir o gestor ${selectedUsuario.nome}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                icon={() => (
                    <MaterialCommunityIcons
                        name="alert-decagram-outline"
                        size={AVATAR_SIZES.lg - 8}
                        style={{ color: COLORS.error }}
                    />
                )}
                onConfirm={confirmDeleteUsuario}
                onCancel={() => setModalVisible(false)}
                loading={deleteUsuario.isPending}
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
