import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS, SPACING, SHADOWS, LOGO_SIZES, FONT_SIZES, BORDER_RADIUS } from "../../themes/tokens";

interface HomeHeaderProps {
    userName: string;
}

export function HomeHeader({ userName }: HomeHeaderProps) {
    return (
        <View style={styles.container}>
            <Image
                source={require("../../../assets/icon.png")}
                width={LOGO_SIZES.sm / 2}
                height={LOGO_SIZES.sm / 2}
                style={styles.logo}
                resizeMode="center"
            />
            <View style={styles.greetingsContainer}>
                <Text style={styles.greetingsText}>Olá,</Text>
                <Text style={styles.userNameText}>{userName}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderBottomRightRadius: BORDER_RADIUS.xxl,
        borderBottomLeftRadius: BORDER_RADIUS.xxl,
        ...SHADOWS.xl,
    },
    logo: {
        width: LOGO_SIZES.sm,
        height: LOGO_SIZES.sm / 2,
        alignSelf: "flex-end",
    },
    greetingsContainer: {
        display: "flex",
        marginBottom: SPACING.md,
    },
    greetingsText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.xl,
    },
    userNameText: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xxl,
        marginTop: -10,
    },
});
