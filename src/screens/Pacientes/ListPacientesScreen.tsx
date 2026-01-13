import React, { useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { BORDER_RADIUS, COLORS, SPACING } from "../../themes/tokens";
import { Header } from "../../components/common/Header";
import { SearchBar } from "../../components/common/SearchBar";
import { GenericCard, Patient } from "../../components/common/GenericCard";
import { CustomButton } from "../../components/common/CustomButton";
import { ConfirmModal } from "../../components/common/Modal";

export default function ListPacientesSreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState("");

    // mock data - substituir por dados reais da API
    const patients: Patient[] = [
        {
            id: "1",
            name: "José Fernando Alves",
            cpf: "234.567.890-11",
            status: "Em viagem",
        },
        {
            id: "2",
            name: "Maria Silva Santos",
            cpf: "123.456.789-00",
            status: "Na casa de apoio",
        },
        {
            id: "3",
            name: "João Pedro Costa",
            cpf: "345.678.901-22",
            status: "Em tratamento",
        },
        {
            id: "4",
            name: "Ana Paula Oliveira",
            cpf: "456.789.012-33",
            status: "Em viagem",
        },
    ];

    const filteredPatients = patients.filter(
        (patient) =>
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.cpf.includes(searchQuery),
    );

    function handleNewPaciente() {
        navigation.navigate("EditCreatePaciente");
    }

    function handlePacientePress(pacienteId: string) {
        navigation.navigate("PacienteDetails", { pacienteId });
    }

    function handleDeletePress(paciente: Patient) {
        setSelectedPatient(paciente.name);
        setModalVisible(true);
    }

    function handleEditPatient(patient: Patient) {
        Alert.alert("TO-DO", `Editar paciente: ${patient.name}`);
    }

    return (
        <View style={styles.container}>
            <Header title="Pacientes" onBack={() => navigation.goBack()} />

            <View style={styles.content}>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Pesquisar..." />

                <CustomButton
                    size="small"
                    title="Novo paciente"
                    style={styles.button_style}
                    contentStyle={styles.button_padding}
                    labelStyle={styles.button_padding}
                    icon={() => (
                        <FontAwesome name="plus" size={16} color={COLORS.surface} style={{ marginRight: SPACING.sm }} />
                    )}
                    onPress={handleNewPaciente}
                />

                <FlatList
                    data={filteredPatients}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <GenericCard
                            fields={[
                                { label: "CPF", value: item.cpf },
                                { label: "Status", value: item.status },
                            ]}
                            title={item.name}
                            onPress={() => handlePacientePress(item.id)}
                            editButton={true}
                            trashButton={true}
                            editButtonAction={() => handleEditPatient(item)}
                            trashButtonAction={() => handleDeletePress(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            </View>

            <ConfirmModal
                visible={modalVisible}
                message={`Tem certeza de que deseja excluir o paciente ${selectedPatient}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                icon={() => (
                    <MaterialCommunityIcons name="alert-decagram-outline" size={56} style={{ color: COLORS.error }} />
                )}
                onConfirm={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                confirmColor={COLORS.error}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.md,
        gap: SPACING.md,
    },
    listContent: {
        paddingBottom: SPACING.xl,
    },
    button_style: {
        alignSelf: "flex-end",
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: 0,
        backgroundColor: COLORS.success,
    },
    button_padding: {
        paddingHorizontal: 0,
    },
});
