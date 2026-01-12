import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from "react-native";
import { CustomButton } from "../../components/common/CustomButton";
import { BORDER_RADIUS, COLORS, FONT_SIZES, LOGO_SIZES, SHADOWS, SPACING } from "../../themes/tokens";
import CustomInput from "../../components/common/CustomInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({}: Props) {
    const [matricula, setMatricula] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const [error, setError] = useState(false);

    async function handleLogin() {
        setLoading(true);

        try {
            await login({ matricula, password });
        } catch (err) {
            console.error("Login error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    function handleForgotPassword() {
        console.log("Forgot password pressed");
        // Implementar lógica de recuperação de senha
    }

    function handleUpdateText(text: string, setter: (value: string) => void) {
        setter(text);
        if (error) {
            setError(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image source={require("../../../assets/icon.png")} style={styles.logo} resizeMode="contain" />
                </View>

                {/* Modal Card */}
                <View style={styles.modal}>
                    {/* Login Title */}

                    <View style={{ marginBottom: SPACING.md }}>
                        <Text style={styles.title}>Login</Text>
                        <Text style={styles.errorText}>{error ? "Matricula ou senha incorretos" : ""}</Text>
                    </View>
                    {/* Form */}
                    <View style={styles.form}>
                        <CustomInput
                            label="Matricula"
                            value={matricula}
                            onChangeText={(text) => handleUpdateText(text, setMatricula)}
                            placeholder="12345678"
                            autoCapitalize="none"
                            error={error}
                            rightIcon="account"
                        />

                        <CustomInput
                            label="Senha"
                            value={password}
                            onChangeText={(text) => handleUpdateText(text, setPassword)}
                            placeholder={"••••••••"}
                            secureTextEntry={!showPassword}
                            rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                            onRightIconPress={() => setShowPassword(!showPassword)}
                            autoComplete="password"
                            error={error}
                        />
                    </View>

                    {/* Forgot Password Link */}
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <View style={styles.buttonContainer}>
                        <CustomButton title="Entrar" onPress={handleLogin} style={{ width: "80%" }} loading={loading} />
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    logo: {
        width: LOGO_SIZES.xl,
        height: LOGO_SIZES.sm,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },
    logoContainer: {
        marginVertical: SPACING.xxxl,
    },
    modal: {
        width: "100%",
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.huge,
        borderTopRightRadius: BORDER_RADIUS.huge,
        height: "100%",
        paddingHorizontal: SPACING.xxl,
        paddingVertical: SPACING.xxl,
        ...SHADOWS.xl,
    },
    title: {
        textAlign: "center",
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.xl,
        fontWeight: "400",
        color: COLORS.text.primary,
    },
    form: {
        width: "100%",
        gap: SPACING.lg,
        marginBottom: SPACING.md,
    },
    forgotPassword: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        fontWeight: "400",
        color: COLORS.link,
        textAlign: "right",
        marginBottom: SPACING.lg,
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: SPACING.md,
    },
    errorText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        fontWeight: "400",
        color: COLORS.error,
        textAlign: "center",
    },
});
