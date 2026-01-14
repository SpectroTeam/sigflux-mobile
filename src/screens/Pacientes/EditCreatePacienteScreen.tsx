import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Header } from "../../components/common/Header";
import { Paciente, PacienteStackParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AVATAR_SIZES, COLORS, SPACING } from "../../themes/tokens";
import DateInput from "../../components/common/DateInput";
import CustomInput from "../../components/common/CustomInput";
import { useKeyboardHeight } from "../../hooks/useKeyboard";
import { useForm, Controller } from "react-hook-form";
import { CustomButton } from "../../components/common/CustomButton";
import { formatCPF, formatRG, formatPhone } from "../../utils/masks";

type Props = NativeStackScreenProps<PacienteStackParamList, "EditCreatePaciente">;

const MIN_DATE = new Date(1900, 0, 1);
const MAX_DATE = new Date();

export default function EditCreatePacienteScreen({ navigation, route }: Props) {
    const {
        control,
        handleSubmit,
        setFocus,
        formState: { errors },
    } = useForm<Paciente>({
        defaultValues: {
            nome: "",
            cpf: "",
            rg: "",
            endereco: "",
            telefone: "",
            birthDate: undefined,
        },
    });

    function cleanChange(value: string, cleanFunc: (val: string) => string, onChange: (val: string) => void) {
        const cleanedValue = cleanFunc(value);
        onChange(cleanedValue);
    }

    async function onSubmit(data: Paciente) {
        console.log(data);
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Header
                title={route.params?.pacienteId ? "Editar Paciente" : "Novo Paciente"}
                onBack={() => navigation.goBack()}
            />

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

                    <Controller
                        control={control}
                        name="rg"
                        rules={{
                            required: "RG é obrigatorio",
                            minLength: { value: 9, message: "RG inválido" },
                        }}
                        render={({ field: { ref, value, onChange } }) => (
                            <CustomInput
                                ref={ref}
                                style={styles.custom_input}
                                value={value}
                                label="RG"
                                placeholder="1.234.567"
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

                    <Controller
                        control={control}
                        name="birthDate"
                        render={({ field: { value, onChange } }) => (
                            <DateInput
                                label="Data de nascimento"
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

                    <CustomButton
                        style={styles.buttonStyle}
                        title="Salvar"
                        onPress={handleSubmit((data) => onSubmit(data))}
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
        width: AVATAR_SIZES.xxl,
    },
    dateInputTextStyle: {
        textAlign: "center",
    },
    buttonStyle: {
        marginTop: SPACING.lg,
    },
});
