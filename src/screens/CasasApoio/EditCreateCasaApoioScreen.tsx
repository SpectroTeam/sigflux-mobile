import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Header } from "../../components/common/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLORS, SPACING } from "../../themes/tokens";
import { useForm, Controller } from "react-hook-form";
import { CustomButton } from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import { useEffect } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";
import {
    CreateCasaApoioDto,
    UpdateCasaApoioDto,
} from "../../types";
import { useCasaApoioById, useCasaApoioMutations } from "../../hooks/useCasasApoio";

type CasaApoioForm = {
    nome: string;
    endereco: string;
    capacidadeMaxima: number;
    lotacaoAtual: number;
};

type CasaApoioStackParamList = {
    EditCreateCasaApoio: { casaApoioId?: string } | undefined;
};

type Props = NativeStackScreenProps<
    CasaApoioStackParamList,
    "EditCreateCasaApoio"
>;

export default function EditCreateCasaApoioScreen({ navigation, route }: Props) {
    const { createCasaApoio, updateCasaApoio, loading } = useCasaApoioMutations();
    const { casaApoio } = useCasaApoioById(route.params?.casaApoioId || "");
    const { showSnackbar } = useSnackbar();

    const {
        control,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors, isDirty },
    } = useForm<CasaApoioForm>({
        defaultValues: {
            nome: "",
            endereco: "",
            capacidadeMaxima: 0,
            lotacaoAtual: 0,
        },
    });

    useEffect(() => {
        if (!casaApoio) return;

        reset({
            nome: casaApoio.nome,
            endereco: casaApoio.endereco,
            capacidadeMaxima: casaApoio.capacidadeMaxima,
            lotacaoAtual: casaApoio.lotacaoAtual,
        });
    }, [casaApoio, reset]);

    async function onSubmit(data: CasaApoioForm) {
        try {
            let response;
            if (casaApoio) {
                response = await updateCasaApoio(casaApoio.id, data as UpdateCasaApoioDto);
            } else {
                response = await createCasaApoio(data as CreateCasaApoioDto);
            }

            if (!response) throw new Error("Erro ao salvar");

            showSnackbar("Casa de apoio salva!", "success", "short");
            navigation.goBack();
        } catch (error) {
            console.error(error);
            showSnackbar("Erro ao salvar casa de apoio.", "error", "short");
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Header
                title={casaApoio ? "Editar Casa de Apoio" : "Nova Casa de Apoio"}
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
                                onSubmitEditing={() => setFocus("endereco")}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="endereco"
                        rules={{ required: "Endereço é obrigatório" }}
                        render={({ field }) => (
                            <CustomInput
                                label="Endereço"
                                value={field.value}
                                onChangeText={field.onChange}
                                errorStr={errors.endereco?.message}
                                onSubmitEditing={() => setFocus("capacidadeMaxima")}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="capacidadeMaxima"
                        rules={{ required: "Capacidade máxima é obrigatória" }}
                        render={({ field }) => (
                            <CustomInput
                                label="Capacidade Máxima"
                                value={String(field.value)}
                                onChangeText={(v) => field.onChange(Number(v))}
                                inputMode="numeric"
                                errorStr={errors.capacidadeMaxima?.message}
                                onSubmitEditing={() => setFocus("lotacaoAtual")}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="lotacaoAtual"
                        rules={{ required: "Lotação atual é obrigatória" }}
                        render={({ field }) => (
                            <CustomInput
                                label="Lotação Atual"
                                value={String(field.value)}
                                onChangeText={(v) => field.onChange(Number(v))}
                                inputMode="numeric"
                                errorStr={errors.lotacaoAtual?.message}
                            />
                        )}
                    />

                    <CustomButton
                        title={casaApoio ? "Atualizar" : "Adicionar"}
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        disabled={loading || (casaApoio ? !isDirty : false)}
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
