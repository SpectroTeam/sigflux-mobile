import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../../themes/tokens";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export interface ButtonProp {
    title: string;
    icon?: IconSource;
    action: () => void;
}

interface GenericCardProps {
    title: string;
    fields: { label: string; value: string }[];
    primaryButton?: ButtonProp;
    secondaryButton?: ButtonProp;
    children?: ReactNode;
    onPress?: () => void;
}

export function GenericCardTest({
    onPress,
    fields,
    title,
    primaryButton,
    secondaryButton,
    children,
}: GenericCardProps) {
    const hasButtons = Boolean(primaryButton || secondaryButton);
    const singleButton = Boolean((primaryButton && !secondaryButton) || (!primaryButton && secondaryButton));

    const ContentWrapper = onPress ? TouchableOpacity : View;

    return (
        <View style={styles.card}>
            <ContentWrapper style={styles.content} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
                <Text style={styles.title}>{title}</Text>

                {fields.map((field, index) => (
                    <Text key={`${field.label}-${index}`} style={styles.info}>
                        <Text style={styles.label}>{field.label}: </Text>
                        {field.value}
                    </Text>
                ))}
                {children}
            </ContentWrapper>

            {hasButtons && <View style={styles.divider} />}

            {hasButtons && (
                <View style={styles.buttonContainer}>
                    {primaryButton && (
                        <Button
                            icon={primaryButton.icon}
                            style={[styles.button, singleButton && styles.fullWidthButton]}
                            contentStyle={styles.buttonContent}
                            labelStyle={[styles.buttonLabel, { color: COLORS.success }]}
                            onPress={primaryButton.action}
                        >
                            {primaryButton.title}
                        </Button>
                    )}

                    {secondaryButton && (
                        <Button
                            icon={secondaryButton.icon}
                            style={[styles.button, singleButton && styles.fullWidthButton]}
                            contentStyle={styles.buttonContent}
                            labelStyle={[styles.buttonLabel, { color: COLORS.error }]}
                            onPress={secondaryButton.action}
                        >
                            {secondaryButton.title}
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
        marginBottom: SPACING.md,
        overflow: "hidden",
    },
    content: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.sm * -1,
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
    label: {
        fontFamily: "Josefin Sans-Bold",
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        width: "100%",
    },
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
    },
    button: {
        width: "50%",
    },
    fullWidthButton: {
        width: "100%",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: SPACING.xs,
    },
    buttonLabel: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
    },
});
