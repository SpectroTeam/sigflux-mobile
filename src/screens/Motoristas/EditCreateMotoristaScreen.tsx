import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Header } from "../../components/common/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS, SPACING } from "../../themes/tokens";
import { useForm, Controller } from "react-hook-form";
import { CustomButton } from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import { useEffect } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { CreateMotoristaDto, UpdateMotoristaDto } from "../../types";
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
    const motoristaId = route.params?.motoristaId;
    const { createMotorista, updateMotorista } = useMotoristaMutations();
    const { motorista, isLoading } = useMotoristaById(motoristaId);
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
            if (motorista) {
                await updateMotorista.mutateAsync({ id: motorista.id, data: data as UpdateMotoristaDto });
            } else {
                await createMotorista.mutateAsync(data as CreateMotoristaDto);
            }

            showSnackbar("Motorista salvo!", "success", "short");
            navigation.goBack();
        } catch (error) {
            console.error(error);
            showSnackbar("Erro ao salvar motorista.", "error", "short");
        }
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <CustomButton loading title="Carregando..." disabled />
            </View>
        );
    }

    const mutationLoading = createMotorista.isPending || updateMotorista.isPending;

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
                        loading={mutationLoading}
                        disabled={mutationLoading || (motorista ? !isDirty : false)}
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
