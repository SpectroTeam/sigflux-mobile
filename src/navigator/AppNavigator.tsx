import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList, MainStackParamList, PacienteStackParamList, RootStackParamList, CasaApoioStackParamList, MotoristaStackParamList} from "../types";
import { COLORS } from "../themes/tokens";
import { useAuth } from "../contexts/AuthContext";

import LoginScreen from "../screens/Auth/LoginScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ListPacientesScreen from "../screens/Pacientes/ListPacientesScreen";
import EditCreatePaciente from "../screens/Pacientes/EditCreatePacienteScreen";
import PacienteDetailsScreen from "../screens/Pacientes/PacienteDetailsScreen";
import PacienteHistoricoViagensScreen from "../screens/Pacientes/PacienteHistoricoViagens";
import PacienteDocumentosAnexadosScreen from "../screens/Pacientes/PacienteDocumentosAnexadosScreen";
import ListAcompanhantesScreen from "../screens/Pacientes/ListAcompanhantesScreen";
import EditCreateAcompanhanteScreen from "../screens/Pacientes/EditCreateAcompanhantes";
import ListCasasApoioScreen from "../screens/CasasApoio/ListCasasApoioScreen";
import EditCreateCasaApoioScreen from "../screens/CasasApoio/EditCreateCasaApoioScreen";
import ListMotoristasScreen from "../screens/Motoristas/ListMotoristasScreen";
import EditCreateMotoristaScreen from "../screens/Motoristas/EditCreateMotoristaScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<MainStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const PacienteStack = createNativeStackNavigator<PacienteStackParamList>();
const CasaApoioStack = createNativeStackNavigator<CasaApoioStackParamList>();
const MotoristaStack = createNativeStackNavigator<MotoristaStackParamList>();

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
            <PacienteStack.Screen name="PacienteHistoricoViagens" component={PacienteHistoricoViagensScreen} />
            <PacienteStack.Screen name="PacienteDocumentosAnexados" component={PacienteDocumentosAnexadosScreen} />
            <PacienteStack.Screen name="ListAcompanhantes" component={ListAcompanhantesScreen} />
            <PacienteStack.Screen name="EditCreateAcompanhante" component={EditCreateAcompanhanteScreen} />
        </PacienteStack.Navigator>
    );
}

// stack de navegação para Casas de Apoio
function CasaApoioNavigator() {
    return (
        <CasaApoioStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <CasaApoioStack.Screen name="ListCasasApoio" component={ListCasasApoioScreen} />
            <CasaApoioStack.Screen name="EditCreateCasaApoio" component={EditCreateCasaApoioScreen} /> 
        </CasaApoioStack.Navigator>
    );
}

// stack de navegação para Motoristas
function MotoristaNavigator() {
    return (
        <MotoristaStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <MotoristaStack.Screen name="ListMotoristas" component={ListMotoristasScreen} />
            <MotoristaStack.Screen name="EditCreateMotorista" component={EditCreateMotoristaScreen} /> 
        </MotoristaStack.Navigator>
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
            <HomeStack.Screen name="CasaApoioStack" component={CasaApoioNavigator} />
            <HomeStack.Screen name="MotoristaStack" component={MotoristaNavigator} />
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
