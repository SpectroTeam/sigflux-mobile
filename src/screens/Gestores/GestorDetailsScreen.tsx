import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet, ScrollView } from "react-native";
import { AVATAR_SIZES, BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { Header } from "../../components/common/Header";
import LabelValue from "../../components/common/LabelValue";
import { UserStackParamList } from "../../types";
import { useUsuarioById, useUsuarioMutations } from "../../hooks/useGestores";
import { CustomButton } from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import { CustomModal } from "../../components/common/Modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<UserStackParamList, "GestorDetails">;

export default function GestorDetailsScreen({ navigation, route }: Props) {
    const { gestorId } = route.params;
    const { usuario, isLoading } = useUsuarioById(gestorId);
    const { changePassword } = useUsuarioMutations();
    const { showSnackbar } = useSnackbar();

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (!isLoading && !usuario) {
            showSnackbar("Gestor não encontrado", "error", "default");
            navigation.goBack();
        }
    }, [usuario, isLoading, navigation, showSnackbar]);

    function clearPasswordFields() {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
    }

    function handleOpenPasswordModal() {
        clearPasswordFields();
        setShowPasswordModal(true);
    }

    async function handleChangePassword() {
        setPasswordError("");

        if (!currentPassword) {
            setPasswordError("Informe a senha atual");
            return;
        }

        if (!newPassword) {
            setPasswordError("Informe a nova senha");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("A nova senha deve ter pelo menos 6 caracteres");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("As senhas não coincidem");
            return;
        }

        try {
            await changePassword.mutateAsync({
                userId: gestorId,
                currentPassword,
                newPassword,
            });
            showSnackbar("Senha alterada com sucesso!", "success", "short");
            setShowPasswordModal(false);
            clearPasswordFields();
        } catch (error: any) {
            setPasswordError(error.message || "Erro ao alterar senha");
        }
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    animating
                    color={COLORS.primary}
                    size={AVATAR_SIZES.large}
                />
            </View>
        );
    }

    if (!usuario) return null;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Header title="Detalhes do Gestor" onBack={() => navigation.goBack()} />

            <ScrollView style={styles.container}>
                <Text style={styles.title}>Dados do gestor</Text>

                <View style={styles.textContainer}>
                    <LabelValue label="Nome: " value={usuario.nomeCompleto} />
                    <LabelValue label="CPF: " value={usuario.cpf} />
                    <LabelValue label="Email: " value={usuario.email} />
                    <LabelValue label="Matrícula: " value={usuario.matricula} />
                    <LabelValue label="Cargo: " value={usuario.cargo} />
                    <LabelValue label="Telefone: " value={usuario.telefone} />
                </View>

                <View style={styles.actionsContainer}>
                    <Text style={styles.sectionTitle}>Ações</Text>
                    
                    <CustomButton
                        title="Alterar Senha"
                        onPress={handleOpenPasswordModal}
                        icon={() => (
                            <MaterialCommunityIcons 
                                name="lock-reset" 
                                size={20} 
                                color={COLORS.surface} 
                                style={{ marginRight: SPACING.xs }}
                            />
                        )}
                    />
                </View>
            </ScrollView>

            <CustomModal
                visible={showPasswordModal}
                message=""
                confirmText="Alterar Senha"
                cancelText="Cancelar"
                onConfirm={handleChangePassword}
                onCancel={() => {
                    setShowPasswordModal(false);
                    clearPasswordFields();
                }}
                loading={changePassword.isPending}
                confirmColor={COLORS.primary}
                icon={() => (
                    <MaterialCommunityIcons 
                        name="lock-reset" 
                        size={AVATAR_SIZES.lg - 8} 
                        color={COLORS.primary} 
                    />
                )}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Alterar Senha</Text>
                    <Text style={styles.modalSubtitle}>
                        Alterar senha do gestor {usuario.nomeCompleto}
                    </Text>

                    <CustomInput
                        label="Senha atual"
                        placeholder="Digite a senha atual"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                        style={styles.modalInput}
                    />

                    <CustomInput
                        label="Nova senha"
                        placeholder="Digite a nova senha"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        style={styles.modalInput}
                    />

                    <CustomInput
                        label="Confirmar nova senha"
                        placeholder="Confirme a nova senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        style={styles.modalInput}
                    />

                    {passwordError ? (
                        <Text style={styles.errorText}>{passwordError}</Text>
                    ) : null}
                </View>
            </CustomModal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    title: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xl + 2,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.lg,
        marginBottom: SPACING.sm,
    },
    actionsContainer: {
        marginTop: SPACING.md,
        gap: SPACING.sm,
    },
    modalContent: {
        width: "100%",
        gap: SPACING.sm,
    },
    modalTitle: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xl,
        textAlign: "center",
        marginBottom: SPACING.xs,
    },
    modalSubtitle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        textAlign: "center",
        color: COLORS.text.light,
        marginBottom: SPACING.md,
    },
    modalInput: {
        backgroundColor: COLORS.background,
    },
    errorText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        textAlign: "center",
        marginTop: SPACING.xs,
    },
});
