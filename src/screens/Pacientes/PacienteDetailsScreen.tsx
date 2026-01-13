import { View } from "react-native";
import { Header } from "../../components/common/Header";

export default function PacienteDetailsScreen({ navigation }: any) {
    return (
        <View>
            <Header title="Detalhes do Paciente" onBack={() => navigation.goBack()} />
        </View>
    );
}
