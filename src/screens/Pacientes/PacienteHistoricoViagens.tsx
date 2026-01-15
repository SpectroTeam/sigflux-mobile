import { View, Text, FlatList, StyleSheet } from "react-native";
import { SPACING, FONT_SIZES, BORDER_RADIUS, COLORS } from "../../themes/tokens";
import { GenericCard } from "../../components/common/GenericCard";
import { Header } from "../../components/common/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Paciente, PacienteStackParamList } from "../../types";

type Props = NativeStackScreenProps<PacienteStackParamList, "PacienteHistoricoViagens">;

export default function PacienteHistoricoViagensScreen({ navigation, route }: Props) {
    const paciente: Paciente = route.params.paciente;

    if (!paciente) {
        navigation.goBack();
        return null;
    }

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
                            { label: "Ida", value: item.dataIda.toLocaleDateString() },
                            { label: "Volta", value: item.dataVolta?.toLocaleDateString() || "indefinido" },
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
        paddingBottom: SPACING.sm
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
