import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getFileName } from "../../utils/file";
import { MD3Colors, ProgressBar } from "react-native-paper";
import { useState } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";

type PDFLinkProps = {
    url: string;
    fileName?: string;
    showIcon?: boolean;
    showFileName?: boolean;
    onDownloadStart?: () => void;
    onDownloadComplete?: (localPath: string) => void;
    onError?: (error: any) => void;
    disabled?: boolean;
    downloadProgress?: boolean;
}

export function PDFLink({
    url,
    fileName,
    showIcon = true,
    showFileName = true,
    onDownloadStart,
    onDownloadComplete,
    onError,
    disabled = false,
    downloadProgress = false,
}: PDFLinkProps) {
    const [downloading, setDownloading] = useState(false);
    const { showSnackbar } = useSnackbar();

    async function downloadPDF() {
        setDownloading(true);
        try {
            onDownloadStart?.();

            const destination = new Directory(Paths.cache, "meus-pdfs");
            const fileToSave = new File(destination, fileName || getFileName(url, "download.pdf"));

            if (!destination.exists) {
                destination.create();
            }

            if (fileToSave.exists) {
                fileToSave.delete();
            }

            const downloadResult = await File.downloadFileAsync(url, fileToSave);
            const { uri } = downloadResult;

            // Pergunta ao usuário o que fazer
            Alert.alert(
                "PDF Baixado",
                "O que você gostaria de fazer?",
                [
                    { text: "Abrir", onPress: () => openPDF(uri) },
                    { text: "Compartilhar", onPress: () => sharePDF(uri) },
                    { text: "Cancelar", style: "cancel" },
                ],
                { cancelable: true },
            );

            onDownloadComplete?.(uri);
        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
            onError?.(error);
            showSnackbar("Erro ao baixar o PDF", "error", "default");
        } finally {
            setDownloading(false);
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
            showSnackbar("Erro ao abrir o PDF", "error", "default");
        }
    }

    async function sharePDF(uri: string) {
        try {
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error("Erro ao compartilhar PDF:", error);
            showSnackbar("Erro ao compartilhar o PDF", "error", "default");
        }
    }

    return (
        <View>
            <TouchableOpacity
                onPress={downloadPDF}
                style={[styles.container, downloading && downloadProgress && styles.downloadRadious]}
                activeOpacity={0.7}
                disabled={disabled}
            >
                {showIcon && <MaterialIcons name="picture-as-pdf" size={24} color={COLORS.error} style={styles.icon} />}
                <View style={styles.textContainer}>
                    {showFileName && <Text style={styles.cazuza}>{fileName || getFileName(url, "download.pdf")}</Text>}
                    <Text style={styles.url} numberOfLines={1}>
                        {url}
                    </Text>
                </View>
                <MaterialIcons name="download" size={20} color={COLORS.primary} style={styles.downloadIcon} />
            </TouchableOpacity>
            {downloadProgress && downloading && (
                <ProgressBar progress={0.5} color={MD3Colors.error50} indeterminate={true} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        borderWidth: 0.5,
        borderColor: COLORS.border,
    },
    downloadRadious: {
        borderBottomEndRadius: 0,
        borderBottomStartRadius: 0,
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
        lineHeight: FONT_SIZES.sm + 4,
        color: COLORS.text.secondary,
    },
    downloadIcon: {
        opacity: 0.8,
    },
}); 
