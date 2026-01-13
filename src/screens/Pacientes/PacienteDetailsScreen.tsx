import { View } from "react-native";
import { Header } from "../../components/common/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PacienteStackParamList } from "../../types";

type Props = NativeStackScreenProps<PacienteStackParamList, 'PacienteDetails'>;

export default function PacienteDetailsScreen({ navigation }: Props) {
    return (
        <View>
            <Header title="Detalhes do Paciente" onBack={() => navigation.goBack()} />
        </View>
    );
}
