import { ScrollView, Text, StyleSheet, View, KeyboardAvoidingView, Platform, Button } from "react-native";
import { Header } from "../../components/common/Header";
import { CreateViagemDto, ViagemForm, ViagemStackParamList, ViagemStatus } from "../../types";
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
import { VIAGEM_STATUS, VIAGEM_STATUS_OPTIONS, VEICULOS_STATUS } from "../../constants";

type Props = NativeStackScreenProps<ViagemStackParamList, "EditCreateViagens">;

type ViagemFormExtended = ViagemForm & {
    status?: ViagemStatus;
};

const TIPO_DE_VIAGEM = [
    { label: "Ida", value: "Ida" },
    { label: "Volta", value: "Volta" },
];

export default function EditCreateViagemScreen({ navigation, route }: Props) {
    const { data: veiculos } = useVeiculos();
    const { data: motoristas } = useMotoristas();

    const viagemId = route.params?.viagemId;
    const { viagem } = useViagemById(viagemId);
    const { craeteViagem, updateViagem } = useViagemMutations();
    const { showSnackbar } = useSnackbar();

    const isViagemConcluida = viagem?.status === VIAGEM_STATUS.CONCLUIDA;

    // Filtrar veículos disponíveis (inativos) ou incluir o veículo atual da viagem
    const VEICULO_OPTIONS = useMemo(() => {
        if (!veiculos) return [];
        
        const availableVeiculos = veiculos.filter(v => {
            // Se estamos editando, incluir o veículo atual mesmo que esteja em viagem
            if (viagem && v.id === viagem.veiculo[0]?.id) {
                return true;
            }
            // Caso contrário, mostrar apenas veículos inativos
            return v.status === VEICULOS_STATUS.INATIVO;
        });
        
        return availableVeiculos.map(v => ({
            label: `${v.modelo} - ${v.placa} (Cap: ${v.capacidade})`,
            value: v.id,
        }));
    }, [veiculos, viagem]);

    const MOTORISTA_OPTIONS = useMemo(() => (
        (motoristas ?? []).map(m => ({
            label: `${m.nomeCompleto} - ${m.matricula}`,
            value: m.id,
        }))
    ), [motoristas]);

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm<ViagemFormExtended>({
        defaultValues: {
            tipo: "Ida",
            enderecoDestino: "",
            localSaida: "",
            dataHora: new Date(),
            veiculoId: "",
            motoristaId: "",
            status: VIAGEM_STATUS.PLANEJADA,
        },
    });

    useEffect(() => {
        if (!viagem) return;

        reset({
            tipo: viagem.tipo,
            enderecoDestino: viagem.enderecoDestino,
            dataHora: viagem.dataHora
                ? new Date(viagem.dataHora)
                : undefined,
            veiculoId: viagem.veiculo[0]?.id ?? "",
            motoristaId: viagem.motorista[0]?.id ?? "",
            status: viagem.status,
        });
    }, [viagem, reset]);

    function cleanChange(value: string, cleanFunc: (val: string) => string, onChange: (val: string) => void) {
        const cleanedValue = cleanFunc(value);
        onChange(cleanedValue);
    }

    async function onSubmit(form: ViagemFormExtended) {
        try {
            if (!veiculos || !motoristas) {
                throw new Error("Dados não carregados");
            }

            if (!form.veiculoId) throw new Error("Selecione um veículo");
            if (!form.motoristaId) throw new Error("Selecione um motorista");

            if (!form.dataHora) {
                throw new Error("Data da viagem obrigatória");
            }

            const veiculo = veiculos.find(v => v.id === form.veiculoId);
            const motorista = motoristas.find(m => m.id === form.motoristaId);

            if (!veiculo) throw new Error("Veículo inválido");
            if (!motorista) throw new Error("Motorista inválido");

            const payload: CreateViagemDto = {
                tipo: form.tipo,
                enderecoDestino: form.enderecoDestino,
                dataHora: form.dataHora.toISOString(),
                localSaida: form.localSaida,
                veiculo: [veiculo],
                motorista: [motorista],
                passageiros: viagem?.passageiros ?? [],
                paradas: viagem?.paradas ?? [],
                status: form.status || VIAGEM_STATUS.PLANEJADA,
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
                                disabled={isViagemConcluida}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="enderecoDestino"
                        rules={{ required: "Endereço de destino é obrigatório" }}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <CustomInput
                                value={value}
                                onChangeText={onChange}
                                style={styles.input}
                                label="Endereço de destino"
                                placeholder="João Pessoa"
                                errorStr={errors.enderecoDestino?.message}
                                editable={!isViagemConcluida}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name="localSaida"
                        rules={{ required: "Local de saída é obrigatório" }}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <CustomInput
                                value={value}
                                onChangeText={onChange}
                                style={styles.input}
                                label="Local de saída"
                                placeholder="Centro"
                                errorStr={errors.localSaida?.message}
                                editable={!isViagemConcluida}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="dataHora"
                        rules={{ required: "Data obrigatória" }}
                        render={({ field: { value, onChange } }) => (
                            <DateInput
                                label="Data da viagem"
                                value={value}
                                onChange={onChange}
                                minimumDate={new Date()}
                                disabled={isViagemConcluida}
                            />
                        )}
                    />

                    {errors.dataHora && (
                        <Text style={{ color: "red" }}>
                            {errors.dataHora.message}
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
                                disabled={isViagemConcluida}
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
                                disabled={isViagemConcluida}
                            />
                        )}
                    />

                    {viagem && (
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <DropdownComponent
                                    label="Status"
                                    value={field.value || "N/A"}
                                    data={VIAGEM_STATUS_OPTIONS.map(opt => ({ 
                                        label: opt.label, 
                                        value: opt.value 
                                    }))}
                                    onSelect={field.onChange}
                                    placeholder="Selecione o status"
                                    disabled={isViagemConcluida}
                                />
                            )}
                        />
                    )}

                    {!isViagemConcluida && (
                        <CustomButton
                            title={viagem ? "Atualizar" : "Adicionar"}
                            onPress={handleSubmit(onSubmit)}
                            loading={craeteViagem.isPending || updateViagem.isPending}
                            disabled={viagem ? !isDirty : false}
                            style={styles.buttonStyle}
                        />
                    )}

                    {isViagemConcluida && (
                        <Text style={styles.warningText}>
                            Esta viagem foi concluída e não pode ser editada.
                        </Text>
                    )}
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
    warningText: {
        fontFamily: "Josefin Sans",
        color: COLORS.error,
        textAlign: "center",
        marginTop: SPACING.lg,
    },
});
