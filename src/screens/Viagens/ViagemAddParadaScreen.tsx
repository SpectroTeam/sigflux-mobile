import { ScrollView, Text, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Header } from "../../components/common/Header";
import { ViagemStackParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS, SPACING } from "../../themes/tokens";
import { useForm, Controller } from "react-hook-form";
import { CustomButton } from "../../components/common/CustomButton";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { useViagemById, useViagemMutations } from "../../hooks/useViagens";
import { useCasasApoio } from "../../hooks/useCasasApoio";
import DropdownComponent from "../../components/common/DropdownComponent";
import { useEffect, useMemo } from "react";

type Props = NativeStackScreenProps<ViagemStackParamList, "ViagemAddParada">;

type FormData = {
    casaId: string;
};

export default function ViagemAddParadaScreen({ navigation, route }: Props) {
    const { viagemId } = route.params;
    const { data: casasApoio } = useCasasApoio();
    const { viagem, isLoading } = useViagemById(viagemId);
    const { updateViagem } = useViagemMutations();
    const { showSnackbar } = useSnackbar();

    const CASAS_APOIO_OPTIONS = useMemo(
        () =>
            (casasApoio ?? []).map((c) => ({
                label: c.nome,
                value: c.id,
            })),
        [casasApoio],
    );

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            casaId: "",
        },
    });

    useEffect(() => {
        if (!isLoading && !viagem) {
            showSnackbar("Viagem não encontrada", "error", "default");
            navigation.goBack();
        }
    }, [viagem, isLoading, navigation, showSnackbar]);

    async function onSubmit(form: FormData) {
        try {
            if (!viagem || !casasApoio) {
                throw new Error("Dados não carregados");
            }

            if (!form.casaId) {
                throw new Error("Selecione uma casa de apoio");
            }

            // Buscar casa de apoio pelo ID
            const casaApoio = casasApoio.find((c) => c.id === form.casaId);
            if (!casaApoio) {
                throw new Error("Casa de apoio não encontrada");
            }

            // Verificar se parada já está na viagem
            const jaCadastrada = viagem.paradas.some((p) => p.id === form.casaId);

            if (jaCadastrada) {
                throw new Error("Esta parada já está cadastrada na viagem");
            }

            // Adicionar parada à viagem
            const updatedViagem = {
                ...viagem,
                paradas: [...viagem.paradas, casaApoio],
            };

            await updateViagem.mutateAsync({
                id: viagem.id,
                data: updatedViagem,
            });

            showSnackbar("Parada adicionada com sucesso!", "success", "short");
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            showSnackbar(error.message || "Erro ao adicionar parada", "error", "short");
        }
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    if (!viagem) return null;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Header title="Adicionar Parada" onBack={() => navigation.goBack()} />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.subtitle}>Viagem para {viagem.enderecoDestino}</Text>

                    <Text style={styles.paradasInfo}>Paradas atuais: {viagem.paradas.length}</Text>

                    <Controller
                        control={control}
                        name="casaId"
                        rules={{ required: "Casa de apoio obrigatória" }}
                        render={({ field }) => (
                            <DropdownComponent
                                label="Casa de Apoio"
                                value={field.value}
                                data={CASAS_APOIO_OPTIONS}
                                placeholder="Selecione uma casa de apoio"
                                onSelect={field.onChange}
                                errorStr={errors.casaId?.message}
                            />
                        )}
                    />

                    <CustomButton
                        title="Adicionar Parada"
                        onPress={handleSubmit(onSubmit)}
                        loading={updateViagem.isPending}
                        style={styles.buttonStyle}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    formContainer: {
        display: "flex",
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        gap: SPACING.sm,
    },
    subtitle: {
        fontFamily: "Josefin Sans",
        fontSize: 18,
        color: COLORS.text.primary,
        textAlign: "center",
        marginBottom: SPACING.sm,
    },
    paradasInfo: {
        fontFamily: "Josefin Sans",
        fontSize: 14,
        color: COLORS.text.secondary,
        textAlign: "center",
        marginBottom: SPACING.md,
    },
    buttonStyle: {
        marginTop: SPACING.lg,
    },
});

