import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { Header } from "../../components/common/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MotoristaStackParamList } from "../../types";
import LabelValue from "../../components/common/LabelValue";
import { AVATAR_SIZES, BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { List } from "react-native-paper";
import { useMotoristaById } from "../../hooks/useMotoristas";
import { useEffect } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";

type Props = NativeStackScreenProps<MotoristaStackParamList, "MotoristaDetails">;

export default function MotoristaDetailsScreen({ navigation, route }: Props) {
    const { motoristaId } = route.params;
    const { motorista, isLoading } = useMotoristaById(motoristaId);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isLoading && !motorista) {
            showSnackbar("Motorista não encontrado", "error", "default");
            navigation.goBack();
        }
    }, [motorista, isLoading, navigation, showSnackbar]);

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

    if (!motorista) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Detalhes do Motorista" onBack={() => navigation.goBack()} />

            <View style={styles.container}>
                <Text style={styles.title}>Dados do motorista</Text>

                <View style={styles.textContainer}>
                    <LabelValue label="Nome: " value={motorista.nomeCompleto} />
                    <LabelValue label="Matrícula: " value={motorista.matricula} />
                    <LabelValue label="Telefone: " value={motorista.telefone} />
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
                            navigation.navigate("MotoristaDocumentosAnexados", { motoristaId: motorista.id })
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
