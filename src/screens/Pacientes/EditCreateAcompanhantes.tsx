import {
    ScrollView,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Text,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef } from "react";

import { Header } from "../../components/common/Header";
import CustomInput from "../../components/common/CustomInput";
import DropdownComponent from "../../components/common/DropdownComponent";
import { CustomButton } from "../../components/common/CustomButton";

import { CreateAcompanhanteDto, PacienteStackParamList } from "../../types";
import { AVATAR_SIZES, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { formatCPF, formatPhone } from "../../utils/masks";
import { useKeyboardHeight } from "../../hooks/useKeyboard";
import { usePacienteById, usePacienteMutations } from "../../hooks/usePacientes";
import { useSnackbar } from "../../contexts/SnackBarContext";

type Props = NativeStackScreenProps<PacienteStackParamList, "EditCreateAcompanhante">;

const PARENTESCO_OPTIONS = [
    { label: "Pai", value: "pai" },
    { label: "Mãe", value: "mae" },
    { label: "Irmão(ã)", value: "irmao" },
    { label: "Tio(a)", value: "tio" },
    { label: "Avô(ó)", value: "avo" },
    { label: "Cônjuge", value: "conjuge" },
    { label: "Amigo(a)", value: "amigo" },
    { label: "Outro", value: "outro" },
];

export default function EditCreateAcompanhanteScreen({ navigation, route }: Props) {
    const { pacienteId, acompanhanteId } = route.params;
    const isEditMode = acompanhanteId !== undefined;

    const { data: paciente, isLoading } = usePacienteById(pacienteId);
    const { addAcompanhante, updateAcompanhante } = usePacienteMutations();
    const { showSnackbar } = useSnackbar();

    const acompanhanteIdRef = useRef<string | null>(null);

    const {
        control,
        handleSubmit,
        setFocus,
        formState: { errors },
        reset,
    } = useForm<CreateAcompanhanteDto>({
        defaultValues: {
            nomeCompleto: "",
            cpf: "",
            telefone: "",
            parentesco: "",
        },
    });

    /**
     * tenta carregar acompanhante para edição se acompanhanteId for fornecido
     */
    useEffect(() => {
        if (isLoading) return;

        if (!paciente) {
            navigation.goBack();
            return;
        }

        if (!isEditMode) return;

        const acompanhante = paciente.acompanhantes?.find(a => a.id === acompanhanteId);

        if (!acompanhante) {
            navigation.goBack();
            return;
        }

        acompanhanteIdRef.current = acompanhante.id;

        reset({
            nomeCompleto: acompanhante.nomeCompleto,
            cpf: acompanhante.cpf,
            telefone: acompanhante.telefone,
            parentesco: acompanhante.parentesco,
        });
    }, [isLoading, paciente, acompanhanteId, isEditMode, navigation, reset]);

    function applyMask(value: string, formatter: (val: string) => string, onChange: (val: string) => void) {
        onChange(formatter(value));
    }

    async function submitAcompanhante(data: CreateAcompanhanteDto) {
        if (!paciente) return;

        try {
            if (isEditMode && acompanhanteIdRef.current) {
                await updateAcompanhante.mutateAsync({
                    pacienteId: paciente.id,
                    acompanhanteId: acompanhanteIdRef.current,
                    acompanhanteData: data,
                });
            } else {
                await addAcompanhante.mutateAsync({
                    pacienteId: paciente.id,
                    acompanhante: data,
                });
            }

            showSnackbar(`Acompanhante salvo!`, "success", "short");
            navigation.goBack();
        } catch {
            showSnackbar("Erro ao salvar acompanhante.", "error", "short")
        }
    }

    if (isLoading) {
        return <ActivityIndicator animating color={COLORS.primary} size={AVATAR_SIZES.large} />;
    }

    if (!paciente) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title={isEditMode ? "Editar Acompanhante" : "Novo Acompanhante"} onBack={navigation.goBack} />

            <View style={styles.container}>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{paciente.nomeCompleto}</Text>
                    <Text style={styles.subtitle}>CPF: {paciente.cpf}</Text>
                </View>

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
                            render={({ field: { value, onChange, onBlur } }) => (
                                <CustomInput
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    style={styles.input}
                                    label="Nome"
                                    placeholder="Luiza Torres"
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
                            render={({ field: { value, onChange, onBlur } }) => (
                                <CustomInput
                                    value={value}
                                    onChangeText={(val) => applyMask(val, formatCPF, onChange)}
                                    onBlur={onBlur}
                                    style={styles.input}
                                    label="CPF"
                                    placeholder="111.222.333-44"
                                    onSubmitEditing={() => setFocus("telefone")}
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
                            name="telefone"
                            rules={{
                                required: "Telefone é obrigatório",
                                minLength: {
                                    value: 15,
                                    message: "Telefone inválido",
                                },
                            }}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <CustomInput
                                    value={value}
                                    onChangeText={(v) => applyMask(v, formatPhone, onChange)}
                                    onBlur={onBlur}
                                    label="Telefone"
                                    placeholder="83 99191-9191"
                                    inputMode="tel"
                                    maxLength={15}
                                    style={styles.input}
                                    errorStr={errors.telefone?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="parentesco"
                            rules={{ required: "Parentesco é obrigatório" }}
                            render={({ field }) => (
                                <DropdownComponent
                                    label="Parentesco"
                                    value={field.value}
                                    data={PARENTESCO_OPTIONS}
                                    placeholder="Selecione o parentesco"
                                    onSelect={field.onChange}
                                    errorStr={errors.parentesco?.message}
                                />
                            )}
                        />

                        <CustomButton
                            title={isEditMode ? "Salvar" : "Adicionar"}
                            style={styles.button}
                            onPress={handleSubmit((data) => submitAcompanhante(data))}
                            loading={addAcompanhante.isPending || updateAcompanhante.isPending}
                            disabled={addAcompanhante.isPending || updateAcompanhante.isPending}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
    },
    formContainer: {
        display: "flex",
        paddingVertical: SPACING.md,
        gap: SPACING.sm,
    },
    input: {
        backgroundColor: COLORS.surface,
    },
    dateInputContainerStyle: {
        display: "flex",
        alignItems: "flex-start",
        width: AVATAR_SIZES.large,
    },
    dateInputInputStyle: {
        width: AVATAR_SIZES.xxl,
    },
    dateInputTextStyle: {
        textAlign: "center",
    },
    button: {
        marginTop: SPACING.lg,
    },
    headerInfo: {
        backgroundColor: COLORS.background,
    },
    title: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xl - 2,
    },
    subtitle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
    },
});
