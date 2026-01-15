import { Text, StyleSheet, TextStyle } from "react-native";
import { COLORS, FONT_SIZES } from "../../themes/tokens";

type TestingProps = {
    label: string;
    value: string;
    style?: TextStyle;
};

export default function LabelValue({ label, value, style }: TestingProps) {
    return (
        <Text style={[styles.container, style]}>
            <Text style={styles.label}>{label}</Text>
            {value}
        </Text>
    );
}

const styles = StyleSheet.create({
    container: {
        fontFamily: "Josefin Sans",
        color: COLORS.primary,
        fontSize: FONT_SIZES.lg + 2,
    },
    label: {
        fontFamily: "Josefin Sans-Bold",
        lineHeight: FONT_SIZES.lg + 8,
    },
});
