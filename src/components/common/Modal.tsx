import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../themes/tokens";
import { CustomButton } from "./CustomButton";

type Props = {
    visible: boolean;
    title?: string;
    icon?: () => React.ReactNode;
    message?: string;
    confirmText: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor?: string;
    loading?: boolean;
    cancelText?: string;
};

export function ConfirmModal({
    visible,
    title,
    message,
    confirmText,
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    confirmColor = COLORS.primary,
    loading = false,
    icon,
}: Props) {
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onCancel}
                contentContainerStyle={styles.container}
                dismissable={!loading}
            >
                <View style={styles.content}>
                    {icon && icon()}

                    {title && <Text style={styles.title}>{title}</Text>}
                    {message && <Text style={styles.message}>{message}</Text>}

                    <View style={styles.actions}>
                        <CustomButton
                            size="small"
                            title={cancelText}
                            onPress={onCancel}
                            variant="outline"
                            style={styles.button_style}
                            contentStyle={styles.button_content_style}
                            labelStyle={styles.button_label_style}
                            disabled={loading}
                        />

                        <CustomButton
                            size="small"
                            title={confirmText}
                            onPress={onConfirm}
                            style={[styles.button_style, { backgroundColor: confirmColor }]}
                            contentStyle={styles.button_content_style}
                            labelStyle={styles.button_label_style}
                            loading={loading}
                            disabled={loading}
                        />
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.lg,
    },

    content: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        width: "100%",
        maxWidth: 360,
        alignItems: "center",
        gap: SPACING.xs,
    },

    title: {
        fontFamily: "Josefin Sans-Medium",
        fontSize: FONT_SIZES.xl,
        marginBottom: SPACING.sm,
    },

    message: {
        fontFamily: "Josefin Sans-Medium",
        textAlign: "center",
        fontSize: FONT_SIZES.md,
        marginBottom: SPACING.md,
    },

    actions: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        gap: SPACING.sm,
    },

    button_style: {
        borderRadius: BORDER_RADIUS.md,
        width: 140,
    },

    button_content_style: { paddingHorizontal: 0 },
    button_label_style: { paddingHorizontal: 0 },
});
