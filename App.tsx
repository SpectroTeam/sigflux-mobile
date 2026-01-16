import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "./src/hooks/useFonts";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigator/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/queryClient";
import { PaperProvider } from "react-native-paper";

export default function App() {
    const fontsLoaded = useFonts();

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#281919" />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <PaperProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <AppNavigator />
                        <StatusBar style="auto" />
                    </AuthProvider>
                </QueryClientProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
    },
});
