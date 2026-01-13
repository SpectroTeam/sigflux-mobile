import { View } from "react-native";
import { Header } from "../../components/common/Header";
import { PacienteStackParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export default function EditCreatePacienteScreen({ navigation, route }: any) {
    return (
        <View>
            <Header
                title={route.params?.pacienteId ? "Editar Paciente" : "Novo Paciente"}
                onBack={() => navigation.goBack()}
            />
        </View>
    );
}
