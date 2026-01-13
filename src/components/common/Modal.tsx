import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../themes/tokens";
import { CustomButton } from "./CustomButton";

type Props = {
    visible: boolean;
    title?: string;
    icon?: () => React.ReactNode;
    message: string;
    confirmText: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor?: string;
    confirmLoading?: boolean;
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
    confirmLoading = false,
    icon,
}: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {icon && icon()}
                    {title && <Text style={styles.title}>{title}</Text>}
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actions}>
                        <CustomButton
                            size="small"
                            title={cancelText}
                            onPress={onCancel}
                            variant="outline"
                            style={styles.button_style}
                            contentStyle={styles.button_content_style}
                            labelStyle={styles.button_label_style}
                        />

                        <CustomButton
                            size="small"
                            title={confirmText}
                            onPress={onConfirm}
                            style={[styles.button_style, { backgroundColor: confirmColor }]}
                            contentStyle={styles.button_content_style}
                            labelStyle={styles.button_label_style}
                            loading={confirmLoading}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    content: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        width: "85%",
        display: "flex",
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
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        gap: SPACING.sm,
    },

    button_style: {
        alignSelf: "flex-end",
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: 0,
        width: 140,
    },

    button_content_style: { paddingHorizontal: 0 },
    button_label_style: { paddingHorizontal: 0 },
});
