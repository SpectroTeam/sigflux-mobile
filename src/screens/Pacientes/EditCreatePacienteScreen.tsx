import { View } from "react-native";
import { Header } from "../../components/common/Header";
import { PacienteStackParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<PacienteStackParamList, 'EditCreatePaciente'>;

export default function EditCreatePacienteScreen({ navigation, route }: Props) {
    return (
        <View>
            <Header
                title={route.params?.pacienteId ? "Editar Paciente" : "Novo Paciente"}
                onBack={() => navigation.goBack()}
            />
        </View>
    );
}
