import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SPACING, FONT_SIZES, COLORS, BORDER_RADIUS, AVATAR_SIZES } from "../../themes/tokens";
import { Header } from "../../components/common/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MotoristaStackParamList } from "../../types";
import { PDFLink } from "../../components/common/PDFLinkProps";
import { useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { CustomButton } from "../../components/common/CustomButton";
import { Entypo } from "@expo/vector-icons";
import { useMotoristaById } from "../../hooks/useMotoristas";
import { useSnackbar } from "../../contexts/SnackBarContext";

type Props = NativeStackScreenProps<MotoristaStackParamList, "MotoristaDocumentosAnexados">;

export default function MotoristaDocumentosAnexadosScreen({ navigation, route }: Props) {
    const { motorista, isLoading } = useMotoristaById(route.params.motoristaId);
    const { showSnackbar } = useSnackbar();

    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!isLoading && !motorista) {
            showSnackbar("Motorista não encontrado", "error", "default");
            navigation.goBack();
        }
    }, [motorista, isLoading, navigation, showSnackbar]);

    function handleDownloadStart() {
        setIsDownloading(true);
    }

    function handleDownloadComplete() {
        setIsDownloading(false);
    }

    function handleGoBack() {
        if (isDownloading) return;
        navigation.goBack();
    }

    async function handlePickDocument() {
        const result = await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
            copyToCacheDirectory: true,
            multiple: false,
        });

        if (result.canceled) return;

        Alert.alert("TO-DO", "upload de arquivos");
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating color={COLORS.primary} size={AVATAR_SIZES.large} />
            </View>
        );
    }

    if (!motorista) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Documentos Anexados" onBack={handleGoBack} />

            <View style={{ paddingHorizontal: SPACING.xl }}>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{motorista.nome}</Text>
                    <Text style={styles.subtitle}>Matrícula: {motorista.matricula}</Text>
                </View>

                <CustomButton
                    size="small"
                    title="Adicionar"
                    style={styles.buttonStyle}
                    contentStyle={styles.buttonPadding}
                    labelStyle={styles.buttonPadding}
                    onPress={handlePickDocument}
                    icon={() => (
                        <Entypo name="upload" size={16} color={COLORS.surface} style={{ marginRight: SPACING.sm }} />
                    )}
                />

                <FlatList
                    data={motorista.documentosAnexados}
                    keyExtractor={(_, index) => String(index)}
                    renderItem={({ item }) => (
                        <PDFLink
                            url={item}
                            onDownloadStart={handleDownloadStart}
                            onDownloadComplete={handleDownloadComplete}
                            onError={handleDownloadComplete}
                            disabled={isDownloading}
                            downloadProgress={true}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum documento anexado</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerInfo: {
        backgroundColor: COLORS.background,
    },
    listContent: {
        gap: SPACING.sm,
    },
    title: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xl - 2,
    },
    subtitle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: SPACING.xxl,
    },
    emptyText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.xl,
        textAlign: "center",
    },
    buttonStyle: {
        alignSelf: "flex-end",
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: 0,
        backgroundColor: COLORS.success,
        marginVertical: SPACING.md,
    },
    buttonPadding: {
        paddingHorizontal: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
