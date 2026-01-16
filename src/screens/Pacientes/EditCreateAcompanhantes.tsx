import {
    ScrollView,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    Alert,
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

import { Acompanhante, PacienteStackParamList } from "../../types";
import { AVATAR_SIZES, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { formatCPF, formatPhone } from "../../utils/masks";
import { useKeyboardHeight } from "../../hooks/useKeyboard";
import { usePacienteByIndex, usePacienteMutations } from "../../hooks/usePacientes";

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
    const { pacienteIndex, acompanhanteIndex } = route.params;
    const isEditMode = acompanhanteIndex !== undefined;

    const { data: paciente, isLoading } = usePacienteByIndex(pacienteIndex);
    const { addAcompanhante, updateAcompanhante } = usePacienteMutations();

    const acompanhanteIdRef = useRef<string | null>(null);

    const {
        control,
        handleSubmit,
        setFocus,
        formState: { errors },
        reset,
    } = useForm<Acompanhante>({
        defaultValues: {
            nome: "",
            cpf: "",
            telefone: "",
            parentesco: "",
        },
    });

    /**
     * tenta carregar acompanhante para edição se acompanhanteIndex for fornecido
     */
    useEffect(() => {
        if (isLoading) return;

        if (!paciente) {
            navigation.goBack();
            return;
        }

        if (!isEditMode) return;

        const acompanhante = paciente.acompanhantes?.[acompanhanteIndex];

        if (!acompanhante) {
            navigation.goBack();
            return;
        }

        acompanhanteIdRef.current = acompanhante.id;

        reset({
            nome: acompanhante.nome,
            cpf: acompanhante.cpf,
            telefone: acompanhante.telefone,
            parentesco: acompanhante.parentesco,
        });
    }, [isLoading, paciente, acompanhanteIndex, isEditMode, navigation, reset]);

    function applyMask(value: string, formatter: (val: string) => string, onChange: (val: string) => void) {
        onChange(formatter(value));
    }

    async function submitAcompanhante(data: Acompanhante) {
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

            Alert.alert("Sucesso", "Acompanhante salvo com sucesso!");
            navigation.goBack();
        } catch {
            Alert.alert("Erro", "Não foi possível salvar o acompanhante. Tente novamente.");
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
                    <Text style={styles.title}>{paciente.nome}</Text>
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
                            name="nome"
                            rules={{ required: "Nome é obrigatório" }}
                            render={({ field }) => (
                                <CustomInput
                                    {...field}
                                    style={styles.input}
                                    label="Nome"
                                    placeholder="Luiza Torres"
                                    onSubmitEditing={() => setFocus("cpf")}
                                    returnKeyType="next"
                                    submitBehavior="submit"
                                    errorStr={errors.nome?.message}
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
                            render={({ field }) => (
                                <CustomInput
                                    style={styles.input}
                                    label="CPF"
                                    placeholder="111.222.333-44"
                                    onChangeText={(value) => applyMask(value, formatCPF, field.onChange)}
                                    onSubmitEditing={() => setFocus("telefone")}
                                    returnKeyType="next"
                                    submitBehavior="submit"
                                    inputMode="numeric"
                                    maxLength={14}
                                    errorStr={errors.cpf?.message}
                                    {...field}
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
                            render={({ field }) => (
                                <CustomInput
                                    {...field}
                                    label="Telefone"
                                    placeholder="83 99191-9191"
                                    inputMode="tel"
                                    maxLength={15}
                                    style={styles.input}
                                    onChangeText={(v) => applyMask(v, formatPhone, field.onChange)}
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
                            onPress={handleSubmit(submitAcompanhante)}
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
