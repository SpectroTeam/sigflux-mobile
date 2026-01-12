import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "./src/hooks/useFonts";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigator/AppNavigator";

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
            <AppNavigator />
            <StatusBar style="auto" />
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
