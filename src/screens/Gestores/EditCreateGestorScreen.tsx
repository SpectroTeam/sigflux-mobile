import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Header } from "../../components/common/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AVATAR_SIZES, COLORS, SPACING } from "../../themes/tokens";
import CustomInput from "../../components/common/CustomInput";
import { useKeyboardHeight } from "../../hooks/useKeyboard";
import { useForm, Controller } from "react-hook-form";
import { CustomButton } from "../../components/common/CustomButton";
import { useEffect } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { CreateUserDto, UpdateUserDto, User, UserStackParamList } from "../../types";
import { useUsuarioById, useUsuarioMutations } from "../../hooks/useGestores";
import { formatCPF, formatPhone } from "../../utils/masks";

type Props = NativeStackScreenProps<UserStackParamList, "EditCreateGestor">;

export default function EditCreateGestorScreen({ navigation, route }: Props) {
    const gestorId = route.params?.gestorId;
    const { createUsuario, updateUsuario } = useUsuarioMutations();
    const { usuario, isLoading } = useUsuarioById(gestorId);
    const { showSnackbar } = useSnackbar();

    const {
        control,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors, isDirty },
    } = useForm<User>({
        defaultValues: {
            nomeCompleto: "",
            cpf: "",
            matricula: "",
            email: "",
            telefone: "",
            cargo: "",
            password: ""
        },
    });

    useEffect(() => {
        if (!usuario) return;

        reset({
            nomeCompleto: usuario.nomeCompleto,
            cpf: usuario.cpf,
            matricula: usuario.matricula,
            email: usuario.email,
            telefone: usuario.telefone,
            cargo: usuario.cargo,
            password: usuario.password
        });
    }, [usuario, reset]);

    function cleanChange(value: string, cleanFunc: (val: string) => string, onChange: (val: string) => void) {
        const cleanedValue = cleanFunc(value);
        onChange(cleanedValue);
    }

    async function onSubmit(data: User) {
        try {
            if (usuario) {
                await updateUsuario.mutateAsync({ id: usuario.id, data: data as UpdateUserDto });
            } else {
                await createUsuario.mutateAsync(data as CreateUserDto);
            }

            showSnackbar("Gestor salvo!", "success", "short");
            navigation.goBack();
        } catch (error) {
            console.error(error);
            showSnackbar("Erro ao salvar gestor.", "error", "short");
        }
    }

    const mutationLoading = createUsuario.isPending || updateUsuario.isPending;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Header title={usuario ? "Editar Gestor" : "Novo Gestor"} onBack={() => navigation.goBack()} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={useKeyboardHeight() * 0.1 + SPACING.lg}
            >
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Controller
                        control={control}
                        name="nomeCompleto"
                        rules={{ required: "Nome é obrigatório" }}
                        render={({ field }) => (
                            <CustomInput
                                style={styles.custom_input}
                                label="Nome completo"
                                placeholder="João da Silva"
                                value={field.value}
                                onChangeText={field.onChange}
                                onSubmitEditing={() => setFocus("cpf")}
                                returnKeyType="next"
                                submitBehavior="submit"
                                errorStr={errors.nomeCompleto?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="cpf"
                        rules={{
                            required: "CPF é obrigatório",
                            minLength: { value: 14, message: "CPF inválido" },
                        }}
                        render={({ field: { value, onChange } }) => (
                            <CustomInput
                                style={styles.custom_input}
                                label="CPF"
                                placeholder="111.222.333-44"
                                value={value}
                                onChangeText={(value) => cleanChange(value, formatCPF, onChange)}
                                onSubmitEditing={() => setFocus("matricula")}
                                returnKeyType="next"
                                submitBehavior="submit"
                                inputMode="numeric"
                                maxLength={14}
                                errorStr={errors.cpf?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="matricula"
                        rules={{
                            required: "Matricula é obrigatório",
                        }}
                        render={({ field }) => (
                            <CustomInput
                                style={styles.custom_input}
                                label="Matriclua"
                                placeholder="123456"
                                value={field.value}
                                onChangeText={field.onChange}
                                onSubmitEditing={() => setFocus("email")}
                                returnKeyType="next"
                                submitBehavior="submit"
                                errorStr={errors.matricula?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: "Email é obrigatório",
                        }}
                        render={({ field }) => (
                            <CustomInput
                                style={styles.custom_input}
                                label="Email"
                                placeholder="joao@dominio.com"
                                value={field.value.toString()}
                                onChangeText={field.onChange}
                                onSubmitEditing={() => setFocus("telefone")}
                                returnKeyType="next"
                                submitBehavior="submit"
                                errorStr={errors.email?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="telefone"
                        rules={{
                            required: "Telefone é obrigatório!",
                            minLength: { value: 15, message: "Telefone inválido" },
                        }}
                        render={({ field: { ref, value, onChange } }) => (
                            <CustomInput
                                ref={ref}
                                style={styles.custom_input}
                                value={value}
                                label="Telefone"
                                placeholder="83 991919191"
                                onChangeText={(value) => cleanChange(value, formatPhone, onChange)}
                                inputMode="tel"
                                autoComplete="tel"
                                onSubmitEditing={() => setFocus("cargo")}
                                returnKeyType="next"
                                submitBehavior="blurAndSubmit"
                                errorStr={errors.telefone?.message}
                                maxLength={15}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="cargo"
                        rules={{
                            required: "Cargo é obrigatório!",
                        }}
                        render={({ field }) => (
                            <CustomInput
                                style={styles.custom_input}
                                value={field.value.toString()}
                                label="Cargo"
                                placeholder="Gestor"
                                onChangeText={field.onChange}
                                inputMode="numeric"
                                returnKeyType="next"
                                submitBehavior="blurAndSubmit"
                                errorStr={errors.cargo?.message}
                            />
                        )}
                    />

                    <CustomButton
                        style={styles.buttonStyle}
                        title={!!usuario ? "Atualizar" : "Adicionar"}
                        onPress={handleSubmit((data) => onSubmit(data))}
                        loading={createUsuario.isPending}
                        disabled={
                            createUsuario.isPending || updateUsuario.isPending || (!!usuario ? !isDirty : false)
                        }
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        display: "flex",
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        gap: SPACING.sm,
    },
    custom_input: {
        backgroundColor: COLORS.surface,
    },
    dateInputContainerStyle: {
        display: "flex",
        alignItems: "flex-start",
        width: AVATAR_SIZES.large,
    },
    dateInputInputStyle: {
        width: "100%",
        paddingVertical: SPACING.md,
    },
    dateInputTextStyle: {
        textAlign: "center",
    },
    buttonStyle: {
        marginTop: SPACING.lg,
    },
    row: {
        flexDirection: "row",
        gap: SPACING.sm,
    },
    half: {
        flex: 1,
    },
});
