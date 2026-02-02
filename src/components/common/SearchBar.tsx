import React from "react";
import { View, TextInput, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../../themes/tokens";

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

export function SearchBar({ value, onChangeText, placeholder = "Pesquisar...", containerStyle }: SearchBarProps) {
    return (
        <View style={[styles.container, containerStyle]}>
            <MaterialIcons name="search" size={24} color={COLORS.text.secondary} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.text.secondary}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 46,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.md,
        gap: SPACING.sm,
    },
    input: {
        flex: 1,
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
        color: COLORS.primary,
    },
});
