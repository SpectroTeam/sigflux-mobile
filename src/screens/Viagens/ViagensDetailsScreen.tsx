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

    if (!viagem) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Detalhes da Viagem" onBack={() => navigation.goBack()} />

            <View style={styles.container}>
                <Text style={styles.title}>Dados da viagem</Text>

                <View style={styles.textContainer}>
                    <LabelValue label="Destino: " value={viagem.cidade_destino} />
                    <LabelValue label="Data e hora: " value={viagem.data_hora} />
                    <LabelValue label="Status: " value={viagem.status} />
                </View>

                <Text style={styles.title}>Passageiros</Text>

                <List.Section style={styles.listSection}>
                    {viagem.passageiros.map((p, index) => (
                        <LabelValue key={index} label={`Passageiro ${index + 1}: `} value={`${p.cpf} - ${p.nome}`} />
                    ))}
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
