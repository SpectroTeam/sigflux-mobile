import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ViagemStackParamList, CasaApoio } from "../../types";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useEffect, useState, useMemo } from "react";
import { ActivityIndicator, View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { AVATAR_SIZES, BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { Header } from "../../components/common/Header";
import { useViagemById, useViagemMutations } from "../../hooks/useViagens";
import { useCasasApoio } from "../../hooks/useCasasApoio";
import { FooterSegmented } from "../../components/common/FooterSegmented";
import { GenericCardTest } from "../../components/common/GenericCardTest";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { SearchBar } from "../../components/common/SearchBar";
import { VIAGEM_STATUS } from "../../constants";

type Props = NativeStackScreenProps<ViagemStackParamList, "ViagemParadas">;

export default function ViagemParadasScreen({ navigation, route }: Props) {
    const { viagemId } = route.params;
    const { viagem, isLoading } = useViagemById(viagemId);
    const { data: allCasasApoio = [] } = useCasasApoio();
    const { addParada, removeParada } = useViagemMutations();
    const { showSnackbar } = useSnackbar();
    
    const [viewMode, setViewMode] = useState<"listar" | "adicionar">("listar");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!isLoading && !viagem) {
            showSnackbar("Viagem não encontrada", "error", "default");
            navigation.goBack();
        }
    }, [viagem, isLoading, navigation, showSnackbar]);

    const isViagemConcluida = viagem?.status === VIAGEM_STATUS.CONCLUIDA;

    // Filtrar casas de apoio disponíveis (que não estão na viagem)
    const availableCasasApoio = useMemo(() => {
        if (!viagem) return [];
        return allCasasApoio.filter((casa) => {
            const notInViagem = !viagem.paradas.some((p) => p.id === casa.id);
            const matchesSearch = 
                casa.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                casa.endereco.toLowerCase().includes(searchQuery.toLowerCase());
            return notInViagem && matchesSearch;
        });
    }, [allCasasApoio, viagem, searchQuery]);

    const handleAddParada = async (casaApoioId: string) => {
        try {
            await addParada.mutateAsync({ viagemId, casaApoioId });
            showSnackbar("Parada adicionada com sucesso", "success", "default");
        } catch (error: any) {
            showSnackbar(error.message || "Erro ao adicionar parada", "error", "default");
        }
    };

    const handleRemoveParada = (casa: CasaApoio) => {
        if (isViagemConcluida) {
            showSnackbar("Não é possível remover paradas de uma viagem concluída", "error", "default");
            return;
        }
        
        Alert.alert(
            "Confirmar Remoção",
            `Deseja remover a parada "${casa.nome}" da viagem?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeParada.mutateAsync({ viagemId, casaApoioId: casa.id });
                            showSnackbar("Parada removida com sucesso", "success", "default");
                        } catch (error: any) {
                            showSnackbar(error.message || "Erro ao remover parada", "error", "default");
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating color={COLORS.primary} size={AVATAR_SIZES.large} />
            </View>
        );
    }

    if (!viagem) return null;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Header title="Paradas da Viagem" onBack={() => navigation.goBack()} />

            <View style={styles.container}>
                <Text style={styles.subtitle}>Viagem para {viagem.cidade_destino}</Text>

                {isViagemConcluida && (
                    <View style={styles.warningContainer}>
                        <Text style={styles.warningText}>
                            Esta viagem foi concluída. Não é possível adicionar ou remover paradas.
                        </Text>
                    </View>
                )}

                {viewMode === "listar" ? (
                    <FlatList
                        data={viagem.paradas}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <GenericCardTest
                                title={item.nome}
                                fields={[
                                    { label: "Endereço", value: item.endereco },
                                    { 
                                        label: "Capacidade", 
                                        value: `${item.lotacaoAtual}/${item.capacidadeMaxima}` 
                                    },
                                ]}
                                primaryButton={!isViagemConcluida ? {
                                    title: "Remover",
                                    icon: () => <Feather name="trash-2" size={20} color={COLORS.error} />,
                                    action: () => handleRemoveParada(item),
                                } : undefined}
                            />
                        )}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Nenhuma parada cadastrada</Text>
                        }
                        contentContainerStyle={styles.listContent}
                    />
                ) : (
                    <>
                        <SearchBar
                            placeholder="Buscar casa de apoio..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            containerStyle={styles.searchBar}
                        />
                        <FlatList
                            data={availableCasasApoio}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <GenericCardTest
                                    title={item.nome}
                                    fields={[
                                        { label: "Endereço", value: item.endereco },
                                        { 
                                            label: "Capacidade", 
                                            value: `${item.lotacaoAtual}/${item.capacidadeMaxima}` 
                                        },
                                    ]}
                                    primaryButton={{
                                        title: "Adicionar",
                                        icon: () => <Feather name="plus" size={20} color={COLORS.success} />,
                                        action: () => handleAddParada(item.id),
                                    }}
                                />
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>
                                    Nenhuma casa de apoio disponível encontrada
                                </Text>
                            }
                            contentContainerStyle={styles.listContent}
                        />
                    </>
                )}
            </View>

            {!isViagemConcluida && (
                <FooterSegmented value={viewMode} onChange={setViewMode} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    subtitle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
        color: COLORS.text.primary,
        textAlign: "center",
        marginBottom: SPACING.md,
    },
    searchBar: {
        marginBottom: SPACING.md,
    },
    listContent: {
        paddingBottom: SPACING.xl,
    },
    emptyText: {
        textAlign: "center",
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
        fontStyle: "italic",
        marginTop: SPACING.xl,
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
});
