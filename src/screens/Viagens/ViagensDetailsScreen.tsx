import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ViagemStackParamList } from "../../types";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useEffect } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { AVATAR_SIZES, BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { Header } from "../../components/common/Header";
import LabelValue from "../../components/common/LabelValue";
import { List } from "react-native-paper";
import { useViagemById } from "../../hooks/useViagens";
import { formatDateBR } from "../../utils/masks";
import { Feather } from "@expo/vector-icons";
import { CustomButton } from "../../components/common/CustomButton";

type Props = NativeStackScreenProps<ViagemStackParamList, "ViagemDetails">;

export default function ViagemDetailsScreen({ navigation, route }: Props) {
    const { viagemId } = route.params;
    const { viagem, isLoading } = useViagemById(viagemId);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isLoading && !viagem) {
            showSnackbar("Viagem não encontrada", "error", "default");
            navigation.goBack();
        }
    }, [viagem, isLoading, navigation, showSnackbar]);

    function handleEditViagem() {
        navigation.navigate("EditCreateViagens", { viagemId });
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating color={COLORS.primary} size={AVATAR_SIZES.large} />
            </View>
        );
    }

    if (!viagem) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Detalhes da Viagem" onBack={() => navigation.goBack()} />

            <View style={styles.container}>
                <View style={styles.upperRow}>
                    <Text style={styles.title}>Dados da viagem</Text>
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
                    ></CustomButton>
                </View>

                <View style={styles.textContainer}>
                    <LabelValue label="Tipo: " value={viagem.tipo} />
                    <LabelValue label="Destino: " value={viagem.cidade_destino} />
                    <LabelValue label="Data e hora: " value={formatDateBR(viagem.data_hora)} />
                    <LabelValue
                        label="Veículo: "
                        value={`${viagem.veiculo[0]?.modelo} - ${viagem.veiculo[0]?.placa}`}
                    />
                    <LabelValue
                        label="Motorista: "
                        value={`${viagem.motorista[0]?.nome} - ${viagem.motorista[0]?.matricula}`}
                    />
                    <LabelValue label="Status: " value={viagem.status} />
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
});
