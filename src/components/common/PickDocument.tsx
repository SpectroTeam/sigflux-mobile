import * as DocumentPicker from "expo-document-picker";
import { StyleSheet } from "react-native";
import { CustomButton } from "./CustomButton";

export type PickDocumentsProps = {
    onSelection: (value: DocumentPicker.DocumentPickerAsset) => void;
};

export default function PickDocument({ onSelection }: PickDocumentsProps) {
    async function handlePickDocument() {
        const result = await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
            copyToCacheDirectory: true,
            multiple: false,
        });

        if (result.canceled) return;

        onSelection(result.assets[0]);
    }

    return (
        <CustomButton
            title="Adicionar Documento"
            icon="upload"
            variant="outline"
            size="small"
            onPress={handlePickDocument}
        />
    );
}

const styles = StyleSheet.create({});
