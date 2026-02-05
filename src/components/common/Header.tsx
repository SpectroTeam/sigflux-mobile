import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";

interface HeaderTitleProps {
    title: string;
    onBack?: () => void;
    statusBarColor?: string;
}

export function Header({ title, onBack, statusBarColor = COLORS.background }: HeaderTitleProps) {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={statusBarColor} />
            {onBack && (
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        width: "100%",
    },
    backButton: {
        flex: 0,
        marginTop: 8,
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontFamily: "Josefin Sans-Bold",
        marginRight: 16,
        fontSize: FONT_SIZES.xxl,
        color: COLORS.primary,
    },
});
