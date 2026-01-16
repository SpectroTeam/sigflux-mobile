import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SPACING, FONT_SIZES, COLORS, AVATAR_SIZES } from "../../themes/tokens";
import { GenericCard } from "../../components/common/GenericCard";
import { Header } from "../../components/common/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PacienteStackParamList } from "../../types";
import { formatDateBR } from "../../utils/masks";
import { usePacienteById } from "../../hooks/usePacientes";
import { useEffect } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";

type Props = NativeStackScreenProps<PacienteStackParamList, "PacienteHistoricoViagens">;

export default function PacienteHistoricoViagensScreen({ navigation, route }: Props) {
    const { data: paciente, isLoading } = usePacienteById(route.params.pacienteId);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isLoading && !paciente) {
            showSnackbar("Paciente não encontrado", "error", "default");
            navigation.goBack();
        }
    }, [paciente, isLoading, navigation]);

    if (isLoading) {
        return <ActivityIndicator animating={true} color={COLORS.primary} size={AVATAR_SIZES.large} />;
    }

    if (!paciente) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Historico de Viagens" onBack={() => navigation.goBack()} />

            <View style={styles.headerInfo}>
                <Text style={styles.title}>{paciente.nome}</Text>
                <Text style={styles.subtitle}>CPF: {paciente.cpf}</Text>
            </View>
            <FlatList
                data={paciente.historicoViagens}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <GenericCard
                        title={`${item.destino} - ${item.status}`}
                        fields={[
                            { label: "Ida", value: formatDateBR(item.dataIda) },
                            { label: "Volta", value: item.dataVolta ? formatDateBR(item.dataVolta) : "indefinido" },
                            { label: "Origem", value: item.origem },
                            { label: "Status", value: item.isPresente ? "Presente" : "Ausente" },
                        ]}
                        editButton={false}
                        trashButton={false}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhuma viagem registrada</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerInfo: {
        paddingHorizontal: SPACING.xl,
        backgroundColor: COLORS.background,
        paddingBottom: SPACING.sm,
    },
    listContent: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
    },
    title: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xl - 2,
    },
    subtitle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: SPACING.xxl,
    },
    emptyText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.xl,
        textAlign: "center",
    },
});
