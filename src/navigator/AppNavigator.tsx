import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {  AuthStackParamList, MainStackParamList, RootStackParamList } from "../types";
import { COLORS } from "../themes/tokens";

import LoginScreen from "../screens/Auth/LoginScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import PacientesScreen from "../screens/Pacientes/PacientesScreen";
import { useAuth } from "../contexts/AuthContext";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<MainStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AuthNavigator() {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
    );
}

function HomeNavigator() {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="Pacientes" component={PacientesScreen}  />
        </HomeStack.Navigator>
    );
}

export function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // TO-DO: tela de loading
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }} edges={["top", "bottom"]}>
            <NavigationContainer>
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    {user ? (
                        <RootStack.Screen name="Main" component={HomeNavigator} />
                    ) : (
                        <RootStack.Screen name="Auth" component={AuthNavigator} />
                    )}
                </RootStack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
}
