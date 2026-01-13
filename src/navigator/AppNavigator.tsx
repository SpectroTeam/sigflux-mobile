import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList, MainStackParamList, PacienteStackParamList, RootStackParamList } from "../types";
import { COLORS } from "../themes/tokens";
import { useAuth } from "../contexts/AuthContext";

import LoginScreen from "../screens/Auth/LoginScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ListPacientesScreen from "../screens/Pacientes/ListPacientesScreen";
import EditCreatePaciente from "../screens/Pacientes/EditCreatePacienteScreen";
import PacienteDetailsScreen from "../screens/Pacientes/PacienteDetailsScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<MainStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const PacienteStack = createNativeStackNavigator<PacienteStackParamList>();

// stack de navegação para funcionalidade Pacientes
function PacienteNavigator() {
    return (
        <PacienteStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <PacienteStack.Screen name="ListPacientes" component={ListPacientesScreen} />
            <PacienteStack.Screen name="EditCreatePaciente" component={EditCreatePaciente} />
            <PacienteStack.Screen name="PacienteDetails" component={PacienteDetailsScreen} />
        </PacienteStack.Navigator>
    );
}

// stack de navegação para autenticação
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

// stack de navegação principal apos o login
function HomeNavigator() {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="PacienteStack" component={PacienteNavigator} />
        </HomeStack.Navigator>
    );
}

// se o usuario estiver logado, mostra a stack principal, senao a de autenticacao
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
