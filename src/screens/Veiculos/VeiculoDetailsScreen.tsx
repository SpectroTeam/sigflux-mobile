import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { VeiculoStackParamList } from "../../types";
import { useVeiculoById } from "../../hooks/useVeiculos";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useEffect } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { AVATAR_SIZES, BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { Header } from "../../components/common/Header";
import LabelValue from "../../components/common/LabelValue";
import { List } from "react-native-paper";

type Props = NativeStackScreenProps<VeiculoStackParamList, "VeiculoDetails">;

export default function VeiculoDetailsScreen({ navigation, route }: Props) {
    const { veiculoId } = route.params;
    const { veiculo, isLoading } = useVeiculoById(veiculoId);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isLoading && !veiculo) {
            showSnackbar("Veiculo não encontrado", "error", "default");
            navigation.goBack();
        }
    }, [veiculo, isLoading, navigation, showSnackbar]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    animating
                    color={COLORS.primary}
                    size={AVATAR_SIZES.large}
                />
            </View>
        );
    }

    if (!veiculo) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Detalhes do Veículo" onBack={() => navigation.goBack()} />

            <View style={styles.container}>
                <Text style={styles.title}>Dados do veículo</Text>

                <View style={styles.textContainer}>
                    <LabelValue label="Placa: " value={veiculo.placa} />
                    <LabelValue label="Chassi: " value={veiculo.chassi} />
                    <LabelValue label="Modelo: " value={veiculo.modelo} />
                    <LabelValue label="Ano: " value={veiculo.ano.toString()} />
                    <LabelValue label="Cor: " value={veiculo.cor} />
                    <LabelValue label="Capacidade Máxima: " value={veiculo.capacidade.toString()} />
                    <LabelValue label="Status: " value={veiculo.status} />
                </View>

                <Text style={styles.title}>Outras Informações</Text>

                <List.Section style={styles.listSection}>
                    <List.Item
                        title="Documentos Anexados"
                        left={(props) => (
                            <List.Icon {...props} icon="file-document-outline" />
                        )}
                        right={(props) => (
                            <List.Icon {...props} icon="chevron-right" />
                        )}
                        onPress={() =>
                            navigation.navigate("VeiculoDocumentosAnexados", { veiculoId: veiculo.id })
                        }
                        style={styles.listItem}
                        titleStyle={styles.listItemTitle}
                    />
                </List.Section>
            </View>
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
});
