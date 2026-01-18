import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Header } from "../../components/common/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS, SPACING } from "../../themes/tokens";
import { useForm, Controller } from "react-hook-form";
import { CustomButton } from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import { useEffect } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { CreateMotoristaDto, UpdateMotoristaDto} from "../../types";
import { useMotoristaById, useMotoristaMutations } from "../../hooks/useMotoristas";

type MotoristaForm = {
    nome: string;
    telefone: string;
    matricula: string;
};

type MotoristaStackParamList = {
    EditCreateMotorista: { motoristaId?: string } | undefined;
};

type Props = NativeStackScreenProps<MotoristaStackParamList, "EditCreateMotorista">;

export default function EditCreateMotoristaScreen({ navigation, route }: Props) {
    const { createMotorista, updateMotorista, loading } = useMotoristaMutations();
    const { motorista } = useMotoristaById(route.params?.motoristaId || "");
    const { showSnackbar } = useSnackbar();

    const {
        control,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors, isDirty },
    } = useForm<MotoristaForm>({
        defaultValues: {
            nome: "",
            telefone: "",
            matricula: "",
        },
    });

    useEffect(() => {
        if (!motorista) return;

        reset({
            nome: motorista.nome,
            telefone: motorista.telefone,
            matricula: motorista.matricula,
        });
    }, [motorista, reset]);

    async function onSubmit(data: MotoristaForm) {
        try {
            let response;
            if (motorista) {
                response = await updateMotorista(motorista.id, data as UpdateMotoristaDto);
            } else {
                response = await createMotorista(data as CreateMotoristaDto);
            }

            if (!response) throw new Error("Erro ao salvar");

            showSnackbar("Motorista salvo!", "success", "short");
            navigation.goBack();
        } catch (error) {
            console.error(error);
            showSnackbar("Erro ao salvar motorista.", "error", "short");
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Header
                title={motorista ? "Editar Motorista" : "Novo Motorista"}
                onBack={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Controller
                        control={control}
                        name="nome"
                        rules={{ required: "Nome é obrigatório" }}
                        render={({ field }) => (
                            <CustomInput
                                label="Nome"
                                value={field.value}
                                onChangeText={field.onChange}
                                errorStr={errors.nome?.message}
                                onSubmitEditing={() => setFocus("telefone")}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="telefone"
                        rules={{ required: "Telefone é obrigatório" }}
                        render={({ field }) => (
                            <CustomInput
                                label="Telefone"
                                value={field.value}
                                onChangeText={field.onChange}
                                errorStr={errors.telefone?.message}
                                onSubmitEditing={() => setFocus("matricula")}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="matricula"
                        rules={{ required: "Matrícula é obrigatória" }}
                        render={({ field }) => (
                            <CustomInput
                                label="Matrícula"
                                value={field.value}
                                onChangeText={field.onChange}
                                errorStr={errors.matricula?.message}
                            />
                        )}
                    />

                    <CustomButton
                        title={motorista ? "Atualizar" : "Adicionar"}
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        disabled={loading || (motorista ? !isDirty : false)}
                        style={styles.buttonStyle}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        gap: SPACING.sm,
    },
    buttonStyle: {
        marginTop: SPACING.lg,
    },
});
