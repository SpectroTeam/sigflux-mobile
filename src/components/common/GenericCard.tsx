import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../../themes/tokens";
import { Button } from "react-native-paper";
import { Feather, FontAwesome } from "@expo/vector-icons";

export interface Patient {
    id: string;
    name: string;
    cpf: string;
    status: string;
}

interface GenericCardProps {
    title: string;
    fields: { label: string; value: string }[];
    editButton: boolean;
    deleteButton?: boolean;
    trashButton?: boolean;
    editButtonAction?: (value: any | undefined) => void;
    trashButtonAction?: (value: any | undefined) => void;
    onPress?: () => void;
}

export function GenericCard({
    onPress,
    fields,
    title,
    editButton,
    trashButton,
    editButtonAction,
    trashButtonAction,
}: GenericCardProps) {
    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={0.7}>
                <Text style={styles.title}>{title}</Text>
                {fields.map((field, index) => (
                    <Text key={index} style={styles.info}>
                        <Text style={styles.label}>{field.label}: </Text>
                        {field.value}
                    </Text>
                ))}
            </TouchableOpacity>

            {editButton || trashButton ? <View style={styles.divider} /> : null}

            {!editButton && !trashButton ? null : (
                <View style={styles.button_container}>
                    {editButton && (
                        <Button
                            icon={() => (
                                <Feather name="edit" size={20} color={COLORS.success} style={{ marginBottom: 4 }} />
                            )}
                            style={[styles.button, { width: trashButton ? "50%" : "100%" }]}
                            contentStyle={styles.button_content_style}
                            labelStyle={[styles.button_label_style, { color: COLORS.success }]}
                            onPress={editButtonAction}
                        >
                            Editar
                        </Button>
                    )}

                    {trashButton && (
                        <Button
                            icon={() => (
                                <FontAwesome
                                    name="trash"
                                    size={20}
                                    color={COLORS.secondary}
                                    style={{ marginBottom: 4 }}
                                />
                            )}
                            style={[styles.button, { width: editButton ? "50%" : "100%" }]}
                            contentStyle={[styles.button_content_style]}
                            labelStyle={[styles.button_label_style, { color: COLORS.error }]}
                            onPress={trashButtonAction}
                        >
                            Excluir
                        </Button>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.lg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        display: "flex",
        marginBottom: SPACING.md,
    },
    content: {
        flex: 1,
        paddingVertical: SPACING.md,
        marginTop: -8,
        paddingHorizontal: SPACING.lg,
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        width: "100%",
    },
    button_container: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        borderBottomLeftRadius: BORDER_RADIUS.lg,
        borderBottomRightRadius: BORDER_RADIUS.lg,
        paddingVertical: SPACING.xs,
    },
    button: {
        width: "50%",
    },
    button_content_style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: SPACING.xs,
    },
    button_label_style: {
        fontFamily: "Josefin Sans",
        alignSelf: "flex-end",
        fontSize: FONT_SIZES.lg,
    },
    title: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.lg + 2,
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    info: {
        fontFamily: "Josefin Sans",
        color: COLORS.primary,
        fontSize: FONT_SIZES.md,
    },
    moreButton: {
        padding: SPACING.xs,
    },
    label: {
        fontFamily: "Josefin Sans-Bold",
    },
});
