import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useEffect } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { AVATAR_SIZES, BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { Header } from "../../components/common/Header";
import LabelValue from "../../components/common/LabelValue";
import { List } from "react-native-paper";
import { UserStackParamList } from "../../types";
import { useUsuarioById } from "../../hooks/useGestores";

type Props = NativeStackScreenProps<UserStackParamList, "GestorDetails">;

export default function GestorDetailsScreen({ navigation, route }: Props) {
    const { gestorId } = route.params;
    const { usuario, isLoading } = useUsuarioById(gestorId);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isLoading && !usuario) {
            showSnackbar("Gestor não encontrado", "error", "default");
            navigation.goBack();
        }
    }, [usuario, isLoading, navigation, showSnackbar]);

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

    if (!usuario) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Detalhes do Gestor" onBack={() => navigation.goBack()} />

            <View style={styles.container}>
                <Text style={styles.title}>Dados do gestor</Text>

                <View style={styles.textContainer}>
                    <LabelValue label="Nome: " value={usuario.nome_completo} />
                    <LabelValue label="CPF: " value={usuario.cpf} />
                    <LabelValue label="Email: " value={usuario.email} />
                    <LabelValue label="Matricula: " value={usuario.matricula} />
                    <LabelValue label="Cargo: " value={usuario.cargo} />
                    <LabelValue label="Telefone: " value={usuario.telefone} />
                </View>
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
