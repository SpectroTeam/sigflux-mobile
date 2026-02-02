import { FlatList, View, Text, StyleSheet } from "react-native";
import { Header } from "../../components/common/Header";
import { PassengerCard } from "../../components/Viagem/PassengerCard";
import { SearchBar } from "../../components/common/SearchBar";
import { AvailablePacienteCard } from "../../components/Viagem/AvailablePacienteCard";
import { FooterSegmented } from "../../components/common/FooterSegmented";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "../../contexts/SnackBarContext";
import { usePacientes } from "../../hooks/usePacientes";
import { useViagemById } from "../../hooks/useViagens";
import { COLORS, SPACING, FONT_SIZES } from "../../themes/tokens";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ViagemStackParamList } from "../../types";
import { useViagemPassageiros } from "../../hooks/useViagemPassageiros";

type Props = NativeStackScreenProps<ViagemStackParamList, "ViagemPassageiros">;

export default function ViagemPassageirosScreen({ navigation, route }: Props) {
    const { viagemId } = route.params;
    const { viagem, isLoading } = useViagemById(viagemId);
    const { data: pacientes = [] } = usePacientes();
    const { showSnackbar } = useSnackbar();
    const [viewMode, setViewMode] = useState<"listar" | "adicionar">("listar");

    useEffect(() => {
        if (!isLoading && !viagem) {
            showSnackbar("Viagem não encontrada", "error", "default");
            navigation.goBack();
        }
    }, [viagem, isLoading]);

    if (isLoading) return <Text>loading</Text>;
    if (!viagem) return null;

    const { editingPacienteId, setEditingPacienteId, searchQuery, setSearchQuery, availablePacientes } =
        useViagemPassageiros({
            pacientes,
            passageiros: viagem.passageiros,
        });

    return (
        <View style={styles.screen}>
            <Header title="Passageiros da Viagem" onBack={navigation.goBack} />

            <View style={styles.container}>
                <Text style={styles.subtitle}>Viagem para {viagem.cidade_destino}</Text>

                {viewMode === "listar" ? (
                    <FlatList
                        data={viagem.passageiros}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <PassengerCard
                                paciente={item}
                                isEditing={editingPacienteId === item.id}
                                onEdit={() => setEditingPacienteId(item.id)}
                                onSave={() => setEditingPacienteId(null)}
                                onRemove={() => console.log("remover")}
                            />
                        )}
                    />
                ) : (
                    <>
                        <SearchBar
                            placeholder="Buscar paciente..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            containerStyle={styles.searchBar}
                        />
                        <FlatList
                            data={availablePacientes}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <AvailablePacienteCard paciente={item} onAdd={() => console.log("adicionar")} />
                            )}
                        />
                    </>
                )}
            </View>

            <FooterSegmented value={viewMode} onChange={setViewMode} />
        </View>
    );
}

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    container: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
    },

    subtitle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.lg,
        color: COLORS.text.primary,
        textAlign: "center",
        marginBottom: SPACING.lg,
    },

    searchBar: {
        marginBottom: SPACING.md,
    },
});
