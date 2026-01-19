import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Header } from "../../components/common/Header";
import { CreateVeiculoDto, UpdateVeiculoDto, VeiculoStackParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AVATAR_SIZES, COLORS, SPACING } from "../../themes/tokens";
import CustomInput from "../../components/common/CustomInput";
import { useKeyboardHeight } from "../../hooks/useKeyboard";
import { useForm, Controller } from "react-hook-form";
import { CustomButton } from "../../components/common/CustomButton";
import { useEffect } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useVeiculoById, useVeiculoMutations } from "../../hooks/useVeiculos";

type Props = NativeStackScreenProps<VeiculoStackParamList, "EditCreateVeiculo">;

type VeiculoForm = {
    placa: string;
    chassi: string;
    modelo: string,
    ano: number,
    cor: string,
    capacidade: number
};

export default function EditCreateVeiculoScreen({ navigation, route }: Props) {
    const veiculoId = route.params?.veiculoId;
    const { createVeiculo, updateVeiculo } = useVeiculoMutations();
    const { veiculo, isLoading } = useVeiculoById(veiculoId);
    const { showSnackbar } = useSnackbar();

    const {
        control,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors, isDirty },
    } = useForm<VeiculoForm>({
        defaultValues: {
            placa: "",
            chassi: "",
            modelo: "",
            ano: 0,
            cor: "",
            capacidade: 0,
        },
    });

    useEffect(() => {
        if (!veiculo) return;

        reset({
            placa: veiculo.placa,
            chassi: veiculo.chassi,
            modelo: veiculo.modelo,
            ano: veiculo.ano,
            cor: veiculo.cor,
            capacidade: veiculo.capacidade,
        });
    }, [veiculo, reset]);

    async function onSubmit(data: VeiculoForm) {
        try {
            if (veiculo) {
                await updateVeiculo.mutateAsync({ id: veiculo.id, data: data as UpdateVeiculoDto });
            } else {
                await createVeiculo.mutateAsync(data as CreateVeiculoDto);
            }

            showSnackbar("Veículo salvo!", "success", "short");
            navigation.goBack();
        } catch (error) {
            console.error(error);
            showSnackbar("Erro ao salvar veículo.", "error", "short");
        }
    }

    const mutationLoading = createVeiculo.isPending || updateVeiculo.isPending;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Header title={veiculo ? "Editar Veículo" : "Novo Veículo"} onBack={() => navigation.goBack()} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={useKeyboardHeight() * 0.1 + SPACING.lg}
            >
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Controller
                        control={control}
                        name="placa"
                        rules={{ required: "Placa é obrigatório" }}
                        render={({ field }) => (
                            <CustomInput
                                style={styles.custom_input}
                                label="Placa"
                                placeholder="ABC1D23"
                                value={field.value}
                                onChangeText={field.onChange}
                                onSubmitEditing={() => setFocus("chassi")}
                                returnKeyType="next"
                                submitBehavior="submit"
                                errorStr={errors.placa?.message}
                                
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="chassi"
                        rules={{ required: "Chassi é obrigatório" }}
                        render={({ field }) => (
                            <CustomInput
                                style={styles.custom_input}
                                label="Chassi"
                                placeholder="7b4XmSrL45jkM5374"
                                value={field.value}
                                onChangeText={field.onChange}
                                errorStr={errors.chassi?.message}
                                onSubmitEditing={() => setFocus("modelo")}
                                maxLength={17}
                                returnKeyType="next"
                                submitBehavior="submit"
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="modelo"
                        rules={{
                            required: "Modelo é obrigatório",
                        }}
                        render={({ field }) => (
                            <CustomInput
                                style={styles.custom_input}
                                label="Modelo"
                                placeholder="Doblo"
                                value={field.value}
                                onChangeText={field.onChange}
                                onSubmitEditing={() => setFocus("ano")}
                                returnKeyType="next"
                                submitBehavior="submit"
                                errorStr={errors.modelo?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="ano"
                        rules={{
                            required: "Ano é obrigatório",
                        }}
                        render={({ field }) => (
                            <CustomInput
                                style={styles.custom_input}
                                label="Ano"
                                placeholder="2025"
                                value={field.value.toString()}
                                onChangeText={field.onChange}
                                onSubmitEditing={() => setFocus("cor")}
                                returnKeyType="next"
                                submitBehavior="submit"
                                inputMode="numeric"
                                errorStr={errors.ano?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="cor"
                        rules={{ required: "Cor é obrigatorio!" }}
                        render={({ field }) => (
                            <CustomInput
                                style={styles.custom_input}
                                value={field.value}
                                label="Cor"
                                placeholder="Vermelho"
                                onChangeText={field.onChange}
                                onSubmitEditing={() => setFocus("capacidade")}
                                returnKeyType="next"
                                submitBehavior="submit"
                                errorStr={errors.cor?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="capacidade"
                        rules={{
                            required: "Capacidade é obrigatório!",
                        }}
                        render={({ field }) => (
                            <CustomInput
                                style={styles.custom_input}
                                value={field.value.toString()}
                                label="Capacidade Máxima"
                                placeholder="0"
                                onChangeText={field.onChange}
                                inputMode="numeric"
                                returnKeyType="next"
                                submitBehavior="blurAndSubmit"
                                errorStr={errors.capacidade?.message}
                            />
                        )}
                    />

                    <CustomButton
                        style={styles.buttonStyle}
                        title={!!veiculo ? "Atualizar" : "Adicionar"}
                        onPress={handleSubmit((data) => onSubmit(data))}
                        loading={createVeiculo.isPending}
                        disabled={
                            createVeiculo.isPending || updateVeiculo.isPending || (!!veiculo ? !isDirty : false)
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
