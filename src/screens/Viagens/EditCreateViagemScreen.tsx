import { ScrollView, Text, StyleSheet, View, KeyboardAvoidingView, Platform, Button } from "react-native";
import { Header } from "../../components/common/Header";
import { CreateViagemDto, ViagemForm, ViagemStackParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AVATAR_SIZES, COLORS, SPACING } from "../../themes/tokens";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { CustomButton } from "../../components/common/CustomButton";
import { useEffect, useMemo } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useVeiculos } from "../../hooks/useVeiculos";
import { useViagemById, useViagemMutations } from "../../hooks/useViagens";
import DropdownComponent from "../../components/common/DropdownComponent";
import { useMotoristas } from "../../hooks/useMotoristas";
import { useCasasApoio } from "../../hooks/useCasasApoio";
import CustomInput from "../../components/common/CustomInput";
import { usePacientes } from "../../hooks/usePacientes";
import Ionicons from '@expo/vector-icons/Ionicons';
import DateInput from "../../components/common/DateInput";
import { formatCPF } from "../../utils/masks";

type Props = NativeStackScreenProps<ViagemStackParamList, "EditCreateViagens">;

const TIPO_DE_VIAGEM = [
    { label: "Ida", value: "Ida" },
    { label: "Volta", value: "Volta" },
];

export default function EditCreateViagemScreen({ navigation, route }: Props) {
    const { data: veiculos } = useVeiculos();
    const { data: motoristas } = useMotoristas();
    const { data: pacientes } = usePacientes();
    const { data: casasApoio } = useCasasApoio();

    const acompanhantes =
        pacientes?.flatMap(p => p.acompanhantes ?? []) ?? [];

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

    const PARADAS_OPTIONS = useMemo(() => (
        (casasApoio ?? []).map(c => ({
            label: c.nome,
            value: c.id,
        }))
    ), [casasApoio]);

    const viagemId = route.params?.viagemId;
    const { viagem } = useViagemById(viagemId);
    const { craeteViagem, updateViagem } = useViagemMutations();
    const { showSnackbar } = useSnackbar();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setFocus,
        formState: { errors, isDirty },
    } = useForm<ViagemForm>({
        defaultValues: {
            tipo: "Ida",
            cidade_destino: "",
            data_hora: new Date(),
            veiculoId: "",
            motoristaId: "",
            passageiros: [{ cpf: "" }],
            paradas: [{ casaId: "" }],
        },
    });

    const {
        fields: passageirosFields,
        append: appendPassageiro,
        remove: removePassageiro,
    } = useFieldArray({
        control,
        name: "passageiros",
    });

    const {
        fields: paradasFields,
        append: appendParada,
        remove: removeParada,
    } = useFieldArray({
        control,
        name: "paradas",
    });

    const veiculoId = watch("veiculoId");
    const veiculoSelecionado = veiculos?.find(v => v.id === veiculoId);
    const capacidade = veiculoSelecionado?.capacidade ?? 0;

    const podeAdicionarPassageiro =
        passageirosFields.length < capacidade;

    useEffect(() => {
        if (!viagem) return;

        reset({
            tipo: viagem.tipo,
            data_hora: viagem.data_hora
                ? new Date(viagem.data_hora)
                : undefined,
            veiculoId: viagem.veiculo[0]?.id ?? "",
            motoristaId: viagem.motorista[0]?.id ?? "",
            passageiros: viagem.passageiros.map(p => ({ cpf: p.cpf })),
            paradas: viagem.paradas.map(p => ({ casaId: p.id })),
        });
    }, [viagem, reset]);

    function cleanChange(value: string, cleanFunc: (val: string) => string, onChange: (val: string) => void) {
        const cleanedValue = cleanFunc(value);
        onChange(cleanedValue);
    }

    async function onSubmit(form: ViagemForm) {
        try {
            if (!veiculos || !motoristas || !pacientes || !casasApoio) {
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

            const passageirosResolvidos = form.passageiros.map(p => {
                const cpfLimpo = p.cpf.replace(/\D/g, "");

                const paciente = pacientes.find(
                    x => x.cpf.replace(/\D/g, "") === cpfLimpo
                );
                if (paciente) return paciente;

                const acompanhante = acompanhantes.find(
                    x => x.cpf.replace(/\D/g, "") === cpfLimpo
                );
                if (acompanhante) return acompanhante;

                throw new Error(`CPF não encontrado: ${p.cpf}`);
            });

            const paradasResolvidas = form.paradas.map(p => {
                if (!p.casaId) throw new Error("Casa de apoio não selecionada");

                const casa = casasApoio.find(c => c.id === p.casaId);
                if (!casa) throw new Error("Casa de apoio inválida");

                return casa;
            });

            const payload: CreateViagemDto = {
                tipo: form.tipo,
                cidade_destino: form.cidade_destino,
                data_hora: form.data_hora.toISOString(),
                veiculo: [veiculo],
                motorista: [motorista],
                passageiros: passageirosResolvidos,
                paradas: paradasResolvidas,
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
                    {passageirosFields.map((field, index) => (
                        <View key={field.id}>
                            <Controller
                                control={control}
                                name={`passageiros.${index}.cpf`}
                                rules={{
                                    required: "CPF obrigatório",
                                    minLength: { value: 14, message: "CPF inválido" }
                                }}
                                render={({ field: { value, onChange } }) => (
                                    <CustomInput
                                        placeholder="CPF do passageiro"
                                        label={`Passageiro ${index + 1}`}
                                        value={value}
                                        onChangeText={(value) => cleanChange(value, formatCPF, onChange)}
                                        style={styles.input}
                                        onSubmitEditing={() => setFocus("paradas")}
                                        inputMode="numeric"
                                        maxLength={14}
                                        errorStr={errors.passageiros?.message}
                                        rightIcon={index > 0 ? "trash-can-outline" : undefined}
                                        onRightIconPress={() => removePassageiro(index)}
                                    />
                                )}
                            />
                        </View>
                    ))}

                    <CustomButton
                        size="small"
                        buttonColor={COLORS.success}
                        title="Adicionar novo passageiro"
                        disabled={!podeAdicionarPassageiro}
                        onPress={() => appendPassageiro({ cpf: "" })}
                    />

                    {!podeAdicionarPassageiro && (
                        <Text>Capacidade máxima do veículo atingida</Text>
                    )}
                    {paradasFields.map((field, index) => (
                        <View key={field.id} style={[styles.row, { alignItems: "flex-end" }]}>
                            <View style={{ flex: 1 }}>
                                <Controller
                                    control={control}
                                    name={`paradas.${index}.casaId`}
                                    rules={{ required: "Casa de apoio obrigatória" }}
                                    render={({ field }) => (
                                        <DropdownComponent
                                            label={`Parada ${index + 1}`}
                                            placeholder="Selecione o tipo de viagem"
                                            value={field.value ?? ""}
                                            data={PARADAS_OPTIONS}
                                            onSelect={field.onChange}
                                            errorStr={errors.paradas?.[index]?.casaId?.message}
                                        />
                                    )}
                                />
                            </View>
                            {index > 0 && (  
                                <CustomButton  size="small" icon="trash-can-outline" onPress={() => removeParada(index)} /> 
                            )}
                        </View>
                    ))}

                    <CustomButton
                        size="small"
                        buttonColor={COLORS.success}
                        title="Adicionar nova parada"
                        onPress={() => appendParada({ casaId: "" })}
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
