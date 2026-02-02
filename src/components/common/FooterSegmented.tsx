import { View, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";

type Props = {
    value: "listar" | "adicionar";
    onChange(value: "listar" | "adicionar"): void;
};

const FOOTER_HEIGHT = 72;

const BUTTONS = [
    { value: "listar", label: "Listar", icon: "format-list-bulleted" },
    { value: "adicionar", label: "Adicionar", icon: "plus" },
];

export function FooterSegmented({ value, onChange }: Props) {
    return (
        <View style={styles.footer}>
            <SegmentedButtons
                value={value}
                onValueChange={(v) => onChange(v as Props["value"])}
                theme={{ roundness: BORDER_RADIUS.sm }}
                buttons={BUTTONS.map((btn) => ({
                    ...btn,
                    style: {
                        flex: 1,
                        justifyContent: "center",
                        backgroundColor: value === btn.value ? COLORS.success + "20" : "transparent",
                    },
                    labelStyle: {
                        fontFamily: "Josefin Sans",
                        fontSize: FONT_SIZES.md,
                    },
                }))}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        height: FOOTER_HEIGHT,
    },
});
