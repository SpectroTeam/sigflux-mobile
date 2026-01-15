import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, Linking } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { Directory, File, Paths } from "expo-file-system";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getFileName } from "../../utils/file";

interface PDFLinkProps {
    url: string;
    fileName?: string;
    showIcon?: boolean;
    showFileName?: boolean;
    onDownloadStart?: () => void;
    onDownloadComplete?: (localPath: string) => void;
    onError?: (error: any) => void;
}

export function PDFLink({
    url,
    fileName,
    showIcon = true,
    showFileName = true,
    onDownloadStart,
    onDownloadComplete,
    onError,
}: PDFLinkProps) {
    async function downloadPDF() {
        try {
            onDownloadStart?.();

            const destination = new Directory(Paths.cache, "meus-pdfs");
            const fileToSave = new File(destination, fileName || getFileName(url, "download.pdf"));

            if (fileToSave.exists) {
                fileToSave.delete();
            }

            if (!destination.exists) {
                destination.create();
            }

            const { uri } = await File.downloadFileAsync(url, destination);

            // Pergunta ao usuário o que fazer
            Alert.alert(
                "PDF Baixado",
                "O que você gostaria de fazer?",
                [
                    {
                        text: "Abrir",
                        onPress: () => openPDF(uri),
                    },
                    {
                        text: "Compartilhar",
                        onPress: () => sharePDF(uri),
                    },
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                ],
                { cancelable: true },
            );

            onDownloadComplete?.(uri);
        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
            onError?.(error);
            Alert.alert("Erro", "Não foi possível baixar o PDF");
        }
    }

    async function openPDF(uri: string) {
        try {
            await Sharing.shareAsync(uri, {
                mimeType: "application/pdf",
                dialogTitle: "Abrir PDF",
                UTI: "com.adobe.pdf",
            });
        } catch (error) {
            console.error("Erro ao abrir PDF:", error);
            Alert.alert("Erro", "Não foi possível abrir o PDF");
        }
    }

    async function sharePDF(uri: string) {
        try {
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error("Erro ao compartilhar PDF:", error);
            Alert.alert("Erro", "Não foi possível compartilhar o PDF");
        }
    }

    return (
        <TouchableOpacity onPress={downloadPDF} style={styles.container} activeOpacity={0.7}>
            {showIcon && <MaterialIcons name="picture-as-pdf" size={24} color={COLORS.error} style={styles.icon} />}
            <View style={styles.textContainer}>
                {showFileName && (
                    <Text style={styles.cazuza} numberOfLines={1}>
                        {fileName || getFileName(url, "download.pdf")}
                    </Text>
                )}
                <Text style={styles.url} numberOfLines={1}>
                    {url}
                </Text>
            </View>
            <MaterialIcons name="download" size={20} color={COLORS.primary} style={styles.downloadIcon} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderWidth: 0.5,
        borderColor: COLORS.border,
    },
    icon: {
        marginRight: SPACING.md,
    },
    textContainer: {
        flex: 1,
        marginRight: SPACING.md,
    },
    cazuza: {
        fontSize: FONT_SIZES.md,
        marginBottom: 2,
    },
    url: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
    },
    downloadIcon: {
        opacity: 0.8,
    },
});
