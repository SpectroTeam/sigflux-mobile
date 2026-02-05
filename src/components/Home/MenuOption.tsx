import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { COLORS, FONT_SIZES, SHADOWS, BORDER_RADIUS, LOGO_SIZES } from "../../themes/tokens";

interface MenuOptionProps {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
}

export function MenuOption({ title, icon, onPress }: MenuOptionProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.card}>
                <View style={styles.iconContainer}>{icon}</View>
            </View>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: LOGO_SIZES.md,
        alignItems: "center",
    },
    card: {
        width: LOGO_SIZES.md,
        height: LOGO_SIZES.md,
        backgroundColor: COLORS.secondary,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: "center",
        alignItems: "center",
        ...SHADOWS.md,
        elevation: 0.
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xl,
        color: COLORS.primary,
        textAlign: "center",
    },
});
