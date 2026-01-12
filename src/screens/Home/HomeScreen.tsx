import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../themes/tokens";
import { HomeHeader } from "../../components/Home/HomeHeader";
import { MenuOption } from "../../components/Home/MenuOption";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <HomeHeader userName="Ana Ferreira" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.grid}>
                    <MenuOption
                        title="Pacientes"
                        icon={<MaterialIcons name="people" size={80} color={COLORS.surface} />}
                        onPress={() => console.log("Pacientes pressed")}
                    />

                    <MenuOption
                        title="Gestores"
                        icon={<MaterialIcons name="person" size={80} color={COLORS.surface} />}
                        onPress={() => console.log("Gestores pressed")}
                    />

                    <MenuOption
                        title="Casas de Apoio"
                        icon={<Ionicons name="home" size={80} color={COLORS.surface} />}
                        onPress={() => console.log("Casas de Apoio pressed")}
                    />

                    <MenuOption
                        title="Veículos"
                        icon={<MaterialCommunityIcons name="car" size={80} color={COLORS.surface} />}
                        onPress={() => console.log("Veículos pressed")}
                    />

                    <MenuOption
                        title="Motoristas"
                        icon={<FontAwesome5 name="user-tie" size={70} color={COLORS.surface} />}
                        onPress={() => console.log("Motoristas pressed")}
                    />

                    <MenuOption
                        title="Viagens"
                        icon={<MaterialCommunityIcons name="road-variant" size={80} color={COLORS.surface} />}
                        onPress={() => console.log("Viagens pressed")}
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
