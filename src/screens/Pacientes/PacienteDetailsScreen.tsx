import { View, StyleSheet, Text } from "react-native";
import { Header } from "../../components/common/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PacienteStackParamList } from "../../types";
import LabelValue from "../../components/common/LabelValue";
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";
import { List } from "react-native-paper";
import { usePacienteById } from "../../hooks/usePacientes";
import { formatDateBR } from "../../utils/masks";

type Props = NativeStackScreenProps<PacienteStackParamList, "PacienteDetails">;

export default function PacienteDetailsScreen({ navigation, route }: Props) {
    const { data: paciente } = usePacienteById(route.params.pacienteId);

    if (!paciente) {
        navigation.goBack();
        return;
    }

    return (
        <View style={{ flex: 1 }}>
            <Header title="Detalhes do Paciente" onBack={() => navigation.goBack()} />
            <View style={styles.container}>
                <Text style={styles.title}>Dados pessoais</Text>

                <View style={styles.textContainer}>
                    <LabelValue label="Nome: " value={paciente.nome} />
                    <View style={styles.cpfrgContainer}>
                        <LabelValue label="CPF: " value={paciente.cpf} />
                        <LabelValue label="RG: " value={paciente.rg} />
                    </View>
                    <LabelValue label="Endereço: " value={paciente.endereco} />
                    <LabelValue label="Data de Nascimento: " value={formatDateBR(paciente.birthDate)} />
                    <LabelValue label="Telefone: " value={paciente.telefone} />
                    <LabelValue label="Status: " value={paciente.status} />
                </View>

                <Text style={styles.title}>Outras Informações</Text>

                <List.Section style={styles.listSection}>
                    <List.Item
                        title="Documentos Anexados"
                        left={(props) => <List.Icon {...props} icon="file-document-outline" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate("PacienteDocumentosAnexados", { paciente: paciente })}
                        style={styles.listItem}
                        titleStyle={styles.listItemTitle}
                    />
                    <List.Item
                        title="Acompanhantes"
                        left={(props) => <List.Icon {...props} icon="account-multiple-outline" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate("ListAcompanhantes", { paciente: paciente })}
                        style={styles.listItem}
                        titleStyle={styles.listItemTitle}
                    />
                    <List.Item
                        title="Historico de Viagens"
                        left={(props) => <List.Icon {...props} icon="map-marker-path" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate("PacienteHistoricoViagens", { paciente: paciente })}
                        style={styles.listItem}
                        titleStyle={styles.listItemTitle}
                    />
                </List.Section>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        gap: SPACING.lg,
    },
    textContainer: {
        display: "flex",
        gap: SPACING.md,
    },
    cpfrgContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xl + 2,
    },
    listSection: {
        padding: 0,
        margin: 0,
        gap: SPACING.xs,
    },
    listItem: {
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.xs,
        width: "100%",
        backgroundColor: COLORS.surface,
        paddingHorizontal: 0,
    },
    listItemTitle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
    },
    titlet: {
        textAlign: "center",
        fontFamily: "Josefin Sans-Bold",
        fontSize: FONT_SIZES.xxl,
        color: COLORS.primary,
    },
});
