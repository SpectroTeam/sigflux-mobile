import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../themes/tokens";
import { HomeHeader } from "../../components/Home/HomeHeader";
import { MenuOption } from "../../components/Home/MenuOption";
import { useAuth } from "../../contexts/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../types";
import { useSnackbar } from "../../contexts/SnackBarContext";

type Props = NativeStackScreenProps<MainStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();

    if (!user) {
        showSnackbar("Usuário não autenticado", "error", "default");
        navigation.goBack();
        return;
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <HomeHeader />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.grid}>
                    <MenuOption
                        title="Pacientes"
                        icon={<MaterialIcons name="people" size={80} color={COLORS.surface} />}
                        onPress={() => navigation.navigate("PacienteStack")}
                    />

                    <MenuOption
                        title="Gestores"
                        icon={<MaterialIcons name="person" size={80} color={COLORS.surface} />}
                        onPress={() => navigation.navigate("GestorStack")}
                    />

                    <MenuOption
                        title="Casas de Apoio"
                        icon={<Ionicons name="home" size={80} color={COLORS.surface} />}
                        onPress={() => navigation.navigate("CasaApoioStack")}
                    />

                    <MenuOption
                        title="Veículos"
                        icon={<MaterialCommunityIcons name="car" size={80} color={COLORS.surface} />}
                        onPress={() => navigation.navigate("VeiculoStack")}
                    />

                    <MenuOption
                        title="Motoristas"
                        icon={<FontAwesome5 name="user-tie" size={70} color={COLORS.surface} />}
                        onPress={() => navigation.navigate("MotoristaStack")}
                    />

                    <MenuOption
                        title="Viagens"
                        icon={<MaterialCommunityIcons name="road-variant" size={80} color={COLORS.surface} />}
                        onPress={() => navigation.navigate("ViagemStack")}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xxxl,
        alignItems: "center",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        width: "100%",
        gap: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
    },
});
