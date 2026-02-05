import { ComponentProps, forwardRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../themes/tokens";

interface CustomInputProps extends ComponentProps<typeof TextInput> {
    leftIcon?: string;
    rightIcon?: string;
    focused?: boolean;
    errorStr?: string;
    onRightIconPress?: () => void;
}

const CustomInput = forwardRef<any, CustomInputProps>((props, ref) => {
    const { label, style, leftIcon, rightIcon, focused, errorStr, onRightIconPress, ...inputProps } = props;

    const left = leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined;

    const right = rightIcon ? (
        <TextInput.Icon
            icon={rightIcon}
            onPress={onRightIconPress}
            color={focused ? COLORS.primary : COLORS.text.light}
        />
    ) : undefined;

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                {label && <Text style={styles.label}>{label}</Text>}
                {errorStr && (
                    <Text style={styles.errorText} ellipsizeMode="middle" textBreakStrategy="highQuality">
                        {errorStr}
                    </Text>
                )}
            </View>

            <TextInput
                ref={ref}
                mode="outlined"
                style={[styles.input, style]}
                activeOutlineColor={COLORS.primary}
                placeholderTextColor={COLORS.text.light}
                outlineStyle={styles.outlineStyle}
                contentStyle={styles.contentStyle}
                error={!!errorStr}
                left={left}
                right={right}
                theme={{
                    colors: {
                        outline: COLORS.border,
                        error: COLORS.error,
                    },
                }}
                {...inputProps}
                label={undefined}
            />
        </View>
    );
});

export default CustomInput;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
    },
    labelContainer: {
        display: "flex",
        flexWrap: "nowrap",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    label: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
        marginRight: SPACING.sm,
        alignSelf: "flex-start",
    },
    input: {
        fontSize: FONT_SIZES.md,
        backgroundColor: COLORS.inputBackground,
    },
    outlineStyle: {
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1.5,
    },
    contentStyle: {
        paddingVertical: SPACING.lg,
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
    },
    errorText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        flexShrink: 0.1,
        paddingHorizontal: SPACING.xs,
        paddingVertical: SPACING.xs / 2,
        textAlign: "left",
        alignSelf: "flex-end"
    },
});
