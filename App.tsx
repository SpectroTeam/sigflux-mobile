import { useEffect, useState, useCallback } from "react";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreenExpo from "expo-splash-screen";
import { useFonts } from "./src/hooks/useFonts";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigator/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/queryClient";
import { PaperProvider } from "react-native-paper";
import { SnackbarProvider } from "./src/contexts/SnackBarContext";
import { FONT_SIZES } from "./src/themes/tokens";

// manter a splash screen nativa visível enquanto a aplicação carrega
SplashScreenExpo.preventAutoHideAsync();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const fontsLoaded = useFonts();

    useEffect(() => {
        async function prepare() {
            try {
                // espera as fontes carregarem
                if (!fontsLoaded) {
                    return;
                }
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, [fontsLoaded]);

    // esconde a splash screen quando a aplicação estiver pronta
    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreenExpo.hideAsync();
        }
    }, [appIsReady]);

    // renderiza ate a aplicação estar pronta
    if (!appIsReady) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{fontSize: FONT_SIZES.xl}}>Carregando aplicação...</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                <SnackbarProvider>
                    <PaperProvider>
                        <QueryClientProvider client={queryClient}>
                            <AuthProvider>
                                <AppNavigator />
                                <StatusBar style="auto" />
                            </AuthProvider>
                        </QueryClientProvider>
                    </PaperProvider>
                </SnackbarProvider>
            </View>
        </SafeAreaProvider>
    );
}
