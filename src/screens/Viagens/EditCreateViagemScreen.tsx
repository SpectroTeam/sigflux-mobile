import { ScrollView, Text, StyleSheet, View, KeyboardAvoidingView, Platform, Button } from "react-native";
import { Header } from "../../components/common/Header";
import { CreateViagemDto, ViagemForm, ViagemStackParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AVATAR_SIZES, COLORS, SPACING } from "../../themes/tokens";
import { useForm, Controller } from "react-hook-form";
import { CustomButton } from "../../components/common/CustomButton";
import { useEffect, useMemo } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useVeiculos } from "../../hooks/useVeiculos";
import { useViagemById, useViagemMutations } from "../../hooks/useViagens";
import DropdownComponent from "../../components/common/DropdownComponent";
import { useMotoristas } from "../../hooks/useMotoristas";
import CustomInput from "../../components/common/CustomInput";
import DateInput from "../../components/common/DateInput";

type Props = NativeStackScreenProps<ViagemStackParamList, "EditCreateViagens">;

const TIPO_DE_VIAGEM = [
    { label: "Ida", value: "Ida" },
    { label: "Volta", value: "Volta" },
];

export default function EditCreateViagemScreen({ navigation, route }: Props) {
    const { data: veiculos } = useVeiculos();
    const { data: motoristas } = useMotoristas();

    const VEICULO_OPTIONS = useMemo(() => (
        (veiculos ?? []).map(v => ({
            label: `${v.modelo} - ${v.placa}`,
            value: v.id,
        }))
    ), [veiculos]);

    const MOTORISTA_OPTIONS = useMemo(() => (
        (motoristas ?? []).map(m => ({
            label: `${m.nome} - ${m.matricula}`,
            value: m.id,
        }))
    ), [motoristas]);

    const viagemId = route.params?.viagemId;
    const { viagem } = useViagemById(viagemId);
    const { craeteViagem, updateViagem } = useViagemMutations();
    const { showSnackbar } = useSnackbar();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm<ViagemForm>({
        defaultValues: {
            tipo: "Ida",
            cidade_destino: "",
            data_hora: new Date(),
            veiculoId: "",
            motoristaId: "",
        },
    });

    useEffect(() => {
        if (!viagem) return;

        reset({
            tipo: viagem.tipo,
            data_hora: viagem.data_hora
                ? new Date(viagem.data_hora)
                : undefined,
            veiculoId: viagem.veiculo[0]?.id ?? "",
            motoristaId: viagem.motorista[0]?.id ?? "",
        });
    }, [viagem, reset]);

    function cleanChange(value: string, cleanFunc: (val: string) => string, onChange: (val: string) => void) {
        const cleanedValue = cleanFunc(value);
        onChange(cleanedValue);
    }

    async function onSubmit(form: ViagemForm) {
        try {
            if (!veiculos || !motoristas) {
                throw new Error("Dados não carregados");
            }

            if (!form.veiculoId) throw new Error("Selecione um veículo");
            if (!form.motoristaId) throw new Error("Selecione um motorista");

            if (!form.data_hora) {
                throw new Error("Data da viagem obrigatória");
            }

            const veiculo = veiculos.find(v => v.id === form.veiculoId);
            const motorista = motoristas.find(m => m.id === form.motoristaId);

            if (!veiculo) throw new Error("Veículo inválido");
            if (!motorista) throw new Error("Motorista inválido");

            const payload: CreateViagemDto = {
                tipo: form.tipo,
                cidade_destino: form.cidade_destino,
                data_hora: form.data_hora.toISOString(),
                veiculo: [veiculo],
                motorista: [motorista],
                passageiros: [],
                paradas: [],
                status: "Planejada",
            };

            if (viagem) {
                await updateViagem.mutateAsync({
                    id: viagem.id,
                    data: payload,
                });
            } else {
                await craeteViagem.mutateAsync(payload);
            }

            showSnackbar("Viagem salva com sucesso!", "success", "short");
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            showSnackbar(error.message || "Erro ao salvar", "error", "short");
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Header
                title={viagem ? "Editar Viagem" : "Nova Viagem"}
                onBack={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Controller
                        control={control}
                        name="tipo"
                        rules={{ required: "Tipo obrigatório" }}
                        render={({ field }) => (
                            <DropdownComponent
                                label="Tipo"
                                value={field.value}
                                data={TIPO_DE_VIAGEM}
                                placeholder="Selecione o tipo de viagem"
                                onSelect={field.onChange}
                                errorStr={errors.tipo?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="cidade_destino"
                        rules={{ required: "Cidade de destino é obrigatório" }}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <CustomInput
                                value={value}
                                onChangeText={onChange}
                                style={styles.input}
                                label="Cidade de destino"
                                placeholder="João Pessoa"
                                errorStr={errors.cidade_destino?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="data_hora"
                        rules={{ required: "Data obrigatória" }}
                        render={({ field: { value, onChange } }) => (
                            <DateInput
                                label="Data da viagem"
                                value={value}
                                onChange={onChange}
                                minimumDate={new Date()}
                            />
                        )}
                    />

                    {errors.data_hora && (
                        <Text style={{ color: "red" }}>
                            {errors.data_hora.message}
                        </Text>
                    )}

                    <Controller
                        control={control}
                        name="veiculoId"
                        rules={{ required: "Veículo obrigatório" }}
                        render={({ field }) => (
                            <DropdownComponent
                                label="Veículo"
                                value={field.value}
                                data={VEICULO_OPTIONS}
                                onSelect={field.onChange}
                                placeholder="Selecione o veículo"
                                errorStr={errors.veiculoId?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="motoristaId"
                        rules={{ required: "Motorista obrigatório" }}
                        render={({ field }) => (
                            <DropdownComponent
                                label="Motorista"
                                value={field.value}
                                data={MOTORISTA_OPTIONS}
                                onSelect={field.onChange}
                                placeholder="Selecione o motorista"
                                errorStr={errors.motoristaId?.message}
                            />
                        )}
                    />

                    <CustomButton
                        title={viagem ? "Atualizar" : "Adicionar"}
                        onPress={handleSubmit(onSubmit)}
                        loading={craeteViagem.isPending || updateViagem.isPending}
                        disabled={viagem ? !isDirty : false}
                        style={styles.buttonStyle}
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
    input: {
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
