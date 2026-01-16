import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Header } from "../../components/common/Header";
import { CreatePacienteDto, PacienteForm, PacienteStackParamList, UpdatePacienteDto } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AVATAR_SIZES, COLORS, SPACING } from "../../themes/tokens";
import DateInput from "../../components/common/DateInput";
import CustomInput from "../../components/common/CustomInput";
import { useKeyboardHeight } from "../../hooks/useKeyboard";
import { useForm, Controller } from "react-hook-form";
import { CustomButton } from "../../components/common/CustomButton";
import { formatCPF, formatRG, formatPhone } from "../../utils/masks";
import { usePacienteById, usePacienteMutations } from "../../hooks/usePacientes";
import { useEffect } from "react";
import { PACIENTE_STATUS_OPTIONS } from "../../constants";
import DropdownComponent from "../../components/common/DropdownComponent";
import { useSnackbar } from "../../contexts/SnackBarContext";

type Props = NativeStackScreenProps<PacienteStackParamList, "EditCreatePaciente">;

const MIN_DATE = new Date(1900, 0, 1);
const MAX_DATE = new Date();

export default function EditCreatePacienteScreen({ navigation, route }: Props) {
    const { createPaciente, updatePaciente } = usePacienteMutations();
    const { data: paciente } = usePacienteById(route.params?.pacienteId);
    const { showSnackbar } = useSnackbar();

    const {
        control,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors, isDirty },
    } = useForm<PacienteForm>({
        defaultValues: {
            nome: "",
            cpf: "",
            rg: "",
            endereco: "",
            telefone: "",
            birthDate: new Date(2000, 0, 1),
        },
    });

    useEffect(() => {
        if (!paciente) return;

        reset({
            nome: paciente.nome,
            cpf: paciente.cpf,
            rg: paciente.rg,
            endereco: paciente.endereco,
            telefone: paciente.telefone,
            birthDate: new Date(paciente.birthDate),
            status: paciente.status,
        });
    }, [paciente, reset]);

    function cleanChange(value: string, cleanFunc: (val: string) => string, onChange: (val: string) => void) {
        const cleanedValue = cleanFunc(value);
        onChange(cleanedValue);
    }

    async function onSubmit(data: PacienteForm) {
        const isUpdate = !!paciente;

        // escolhe a operação correta
        const operation = isUpdate
            ? (data: UpdatePacienteDto) => updatePaciente.mutateAsync({ pacienteId: paciente.id, data })
            : (data: CreatePacienteDto) => createPaciente.mutateAsync(data);

        try {
            const formattedData = {
                ...data,
                birthDate: data.birthDate.toISOString(),
            };

            const response = await operation(formattedData);

            if (!response) {
                throw new Error("Operação falhou");
            }

            showSnackbar("Paciente salvo!", "success", "short");
            navigation.replace("PacienteDetails", { pacienteId: response.id });
        } catch (error) {
            console.error("Error saving paciente:", error);
            showSnackbar("Erro ao salvar paciente.", "error", "short");
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Header title={paciente ? "Editar Paciente" : "Novo Paciente"} onBack={() => navigation.goBack()} />

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
                        render={({ field: { ref, onChange, value } }) => (
                            <CustomInput
                                ref={ref}
                                style={styles.custom_input}
                                label="Nome"
                                placeholder="Luiza Torres"
                                value={value}
                                onChangeText={onChange}
                                onSubmitEditing={() => setFocus("cpf")}
                                returnKeyType="next"
                                submitBehavior="submit"
                                errorStr={errors.nome?.message}
                            />
                        )}
                    />
                    <View style={styles.row}>
                        <View style={styles.half}>
                            <Controller
                                control={control}
                                name="cpf"
                                rules={{
                                    required: "CPF é obrigatório",
                                    minLength: { value: 14, message: "CPF inválido" },
                                }}
                                render={({ field: { ref, value, onChange } }) => (
                                    <CustomInput
                                        ref={ref}
                                        style={styles.custom_input}
                                        label="CPF"
                                        placeholder="111.222.333-44"
                                        value={value}
                                        onChangeText={(value) => cleanChange(value, formatCPF, onChange)}
                                        onSubmitEditing={() => setFocus("rg")}
                                        returnKeyType="next"
                                        submitBehavior="submit"
                                        inputMode="numeric"
                                        maxLength={14}
                                        errorStr={errors.cpf?.message}
                                    />
                                )}
                            />
                        </View>

                        <View style={styles.half}>
                            <Controller
                                control={control}
                                name="rg"
                                rules={{
                                    required: "RG é obrigatório",
                                    minLength: { value: 9, message: "RG inválido" },
                                }}
                                render={({ field: { ref, value, onChange } }) => (
                                    <CustomInput
                                        ref={ref}
                                        style={styles.custom_input}
                                        label="RG"
                                        placeholder="1.234.567"
                                        value={value}
                                        onChangeText={(value) => cleanChange(value, formatRG, onChange)}
                                        onSubmitEditing={() => setFocus("endereco")}
                                        returnKeyType="next"
                                        submitBehavior="submit"
                                        inputMode="numeric"
                                        maxLength={9}
                                        errorStr={errors.rg?.message}
                                    />
                                )}
                            />
                        </View>
                    </View>
                    <Controller
                        control={control}
                        name="endereco"
                        rules={{ required: "Endereço é obrigatorio!" }}
                        render={({ field: { ref, value, onChange } }) => (
                            <CustomInput
                                ref={ref}
                                style={styles.custom_input}
                                value={value}
                                label="Endereço"
                                placeholder="Rua flores, 88 - Jardim Oásis, Cajazeiras"
                                onChangeText={onChange}
                                onSubmitEditing={() => setFocus("telefone")}
                                returnKeyType="next"
                                submitBehavior="submit"
                                autoComplete="address-line1"
                                error={!!errors.endereco}
                                errorStr={errors.endereco?.message}
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
                                onSubmitEditing={() => setFocus("birthDate")}
                                returnKeyType="next"
                                submitBehavior="blurAndSubmit"
                                errorStr={errors.telefone?.message}
                                maxLength={15}
                            />
                        )}
                    />

                    <View style={styles.row}>
                        <View style={styles.half}>
                            <Controller
                                control={control}
                                name="birthDate"
                                render={({ field: { value, onChange } }) => (
                                    <DateInput
                                        label="Data Nascimento"
                                        value={value}
                                        onChange={onChange}
                                        containerStyle={styles.dateInputContainerStyle}
                                        inputStyle={styles.dateInputInputStyle}
                                        textStyle={styles.dateInputTextStyle}
                                        maximumDate={MAX_DATE}
                                        minimumDate={MIN_DATE}
                                    />
                                )}
                            />
                        </View>

                        <View style={styles.half}>
                            <Controller
                                control={control}
                                name="status"
                                rules={{ required: "Status é obrigatório" }}
                                render={({ field }) => (
                                    <DropdownComponent
                                        {...field}
                                        label="Status"
                                        value={field.value}
                                        data={PACIENTE_STATUS_OPTIONS as any}
                                        placeholder="Inativo"
                                        onSelect={field.onChange}
                                        errorStr={errors.status?.message}
                                    />
                                )}
                            />
                        </View>
                    </View>

                    <CustomButton
                        style={styles.buttonStyle}
                        title={!!paciente ? "Atualizar" : "Adicionar"}
                        onPress={handleSubmit((data) => onSubmit(data))}
                        loading={createPaciente.isPending}
                        disabled={
                            createPaciente.isPending || updatePaciente.isPending || (!!paciente ? !isDirty : false)
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
