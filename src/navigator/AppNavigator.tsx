import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList, MainStackParamList, PacienteStackParamList, RootStackParamList, CasaApoioStackParamList, MotoristaStackParamList, VeiculoStackParamList, UserStackParamList, ViagemStackParamList} from "../types";
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
import MotoristaDetailsScreen from "../screens/Motoristas/MotoristaDetailsScreen";
import MotoristaDocumentosAnexadosScreen from "../screens/Motoristas/MotoristaDocumentosAnexadosScreen";
import ListVeiculoScreen from "../screens/Veiculos/ListVeiculoScreen";
import EditCreateVeiculoScreen from "../screens/Veiculos/EditCreateVeiculoScreen";
import VeiculoDetailsScreen from "../screens/Veiculos/VeiculoDetailsScreen";
import VeiculoDocumentosAnexadosScreen from "../screens/Veiculos/VeiculoDocumentosAnexadosScreen";
import ListGestoresScreen from "../screens/Gestores/ListGestoresScreen";
import EditCreateGestorScreen from "../screens/Gestores/EditCreateGestorScreen";
import GestorDetailsScreen from "../screens/Gestores/GestorDetailsScreen";
import ListViagensScreen from "../screens/Viagens/ListViagensScreen";
import EditCreateViagemScreen from "../screens/Viagens/EditCreateViagemScreen";
import ViagemDetailsScreen from "../screens/Viagens/ViagensDetailsScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<MainStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const PacienteStack = createNativeStackNavigator<PacienteStackParamList>();
const CasaApoioStack = createNativeStackNavigator<CasaApoioStackParamList>();
const MotoristaStack = createNativeStackNavigator<MotoristaStackParamList>();
const VeiculoStack = createNativeStackNavigator<VeiculoStackParamList>();
const GestorStack = createNativeStackNavigator<UserStackParamList>();
const ViagemStack = createNativeStackNavigator<ViagemStackParamList>();

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
            <MotoristaStack.Screen name="MotoristaDetails" component={MotoristaDetailsScreen} />
            <MotoristaStack.Screen name="MotoristaDocumentosAnexados" component={MotoristaDocumentosAnexadosScreen} />
        </MotoristaStack.Navigator>
    );
}

// stack de navegação para Veiculos
function VeiculoNavigator() {
    return (
        <VeiculoStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <VeiculoStack.Screen name="ListVeiculos" component={ListVeiculoScreen} />
            <VeiculoStack.Screen name="EditCreateVeiculo" component={EditCreateVeiculoScreen} />
            <VeiculoStack.Screen name="VeiculoDetails" component={VeiculoDetailsScreen} />
            <VeiculoStack.Screen name="VeiculoDocumentosAnexados" component={VeiculoDocumentosAnexadosScreen} />
        </VeiculoStack.Navigator>
    );
}

// stack de navegação para Gestores
function GestorNavigator() {
    return (
        <GestorStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <GestorStack.Screen name="ListGestores" component={ListGestoresScreen} />
            <GestorStack.Screen name="EditCreateGestor" component={EditCreateGestorScreen} />
            <GestorStack.Screen name="GestorDetails" component={GestorDetailsScreen} />
        </GestorStack.Navigator>
    );
}

// stack de navegação para Viagens
function ViagemNavigator() {
    return (
        <ViagemStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <ViagemStack.Screen name="ListViagens" component={ListViagensScreen} />
            <ViagemStack.Screen name="EditCreateViagens" component={EditCreateViagemScreen} />
            <ViagemStack.Screen name="ViagemDetails" component={ViagemDetailsScreen} />
        </ViagemStack.Navigator>
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
            <HomeStack.Screen name="VeiculoStack" component={VeiculoNavigator} />
            <HomeStack.Screen name="GestorStack" component={GestorNavigator} />
            <HomeStack.Screen name="ViagemStack" component={ViagemNavigator} />
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
