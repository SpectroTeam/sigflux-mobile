import React, { forwardRef } from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle, StyleProp, TextStyle } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { FONT_SIZES, COLORS, SPACING, BORDER_RADIUS } from "../../themes/tokens";

interface DateInputProps {
    label?: string;
    value?: Date;
    placeholder?: string;
    onChange: (date: Date | undefined) => void;
    maximumDate?: Date;
    minimumDate?: Date;
    disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const DateInput = forwardRef<any, DateInputProps>((props, ref) => {
    const {
        label = "Data",
        placeholder = "01/01/01",
        value,
        onChange,
        maximumDate,
        minimumDate,
        disabled = false,
        containerStyle,
        inputStyle,
        textStyle,
    } = props;

    function openPicker() {
        if (disabled) return;
        
        DateTimePickerAndroid.open({
            value: value ?? new Date(),
            mode: "date",
            display: "spinner",
            maximumDate,
            minimumDate,
            onChange: (_, selectedDate) => {
                if (selectedDate) {
                    onChange(selectedDate);
                }
            },
        });
    }

    const displayValue = value ? value.toLocaleDateString("pt-BR") : placeholder;

    return (
        <View style={[containerStyle, disabled && styles.disabledContainer]}>
            {label && <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text>}

            <Pressable 
                ref={ref} 
                onPress={openPicker} 
                style={[styles.input, inputStyle, disabled && styles.disabledInput]}
                disabled={disabled}
            >
                <Text style={[styles.value, !value && styles.placeholder, textStyle, disabled && styles.disabledText]}>
                    {displayValue}
                </Text>
            </Pressable>
        </View>
    );
});

export default DateInput;

const styles = StyleSheet.create({
    container: {},
    label: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    input: {
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.md - 4,
        borderRadius: BORDER_RADIUS.md,
    },
    value: {
        paddingHorizontal: SPACING.lg,
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
    },
    placeholder: {
        color: COLORS.text.light,
    },
    disabledContainer: {
        opacity: 0.6,
    },
    disabledInput: {
        backgroundColor: COLORS.inputBackground,
    },
    disabledText: {
        color: COLORS.text.light,
    },
});
