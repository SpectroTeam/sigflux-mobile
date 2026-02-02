import { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS, SPACING, SHADOWS, LOGO_SIZES, FONT_SIZES, BORDER_RADIUS, AVATAR_SIZES } from "../../themes/tokens";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { CustomModal } from "../common/Modal";

export function HomeHeader() {
    const [open, setOpen] = useState(false);
    const { logout, user } = useAuth();

    async function handleLogout() {
        await logout();
    }

    return (
        <View style={styles.container}>
            <Image
                source={require("../../../assets/icon.png")}
                width={LOGO_SIZES.sm / 2}
                height={LOGO_SIZES.sm / 2}
                style={styles.logo}
                resizeMode="center"
            />

            <View style={styles.bottom_styles}>
                <View style={styles.greetingsContainer}>
                    <Text style={styles.greetingsText}>Olá,</Text>
                    <Text style={styles.userNameText}>{user?.nomeCompleto}</Text>
                </View>
                <TouchableOpacity>
                    <MaterialIcons
                        name="logout"
                        size={AVATAR_SIZES.sm}
                        color={COLORS.error}
                        onPress={() => setOpen(true)}
                    />
                </TouchableOpacity>
            </View>

            <CustomModal
                visible={open}
                icon={() => <MaterialIcons name="logout" size={AVATAR_SIZES.md} color={COLORS.error} />}
                title="Sair da conta ?"
                confirmText="Sair"
                cancelText="Cancelar"
                confirmColor={COLORS.success}
                onConfirm={handleLogout}
                onCancel={() => setOpen(false)}
            />
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
    bottom_styles: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: SPACING.md,
    },
    greetingsContainer: {
        display: "flex",
        width: "80%",
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
