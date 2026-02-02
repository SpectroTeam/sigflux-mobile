import React from "react";
import {
    StyleSheet,
    View,
    Text,
    StyleProp,
    ViewStyle,
    TextStyle,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
    BORDER_RADIUS,
    COLORS,
    FONT_SIZES,
    SPACING,
} from "../../themes/tokens";

type DropdownItem = {
    label: string;
    value: string;
};

type DropdownComponentProps = {
    label?: string;
    data: DropdownItem[];
    onSelect?: (value: string) => void;
    placeholder?: string;
    value: string;
    errorStr?: string;
    disabled?: boolean;

    containerStyle?: StyleProp<ViewStyle>;
    dropdownStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    errorStyle?: StyleProp<TextStyle>;
    textStyle?: StyleProp<TextStyle>;
};

export default function DropdownComponent({
    label,
    data,
    onSelect,
    placeholder = "Select Item",
    value,
    errorStr,
    disabled = false,
    containerStyle,
    dropdownStyle,
    labelStyle,
    errorStyle,
    textStyle,
}: DropdownComponentProps) {
    function handleSelect(item: DropdownItem) {
        if (disabled) return;
        onSelect?.(item.value);
    }

    return (
        <View style={[containerStyle, disabled && styles.disabledContainer]}>
            <View style={styles.labelContainer}>
                {label && (
                    <Text style={[styles.label, labelStyle, disabled && styles.disabledText]}>
                        {label}
                    </Text>
                )}

                {errorStr && (
                    <Text
                        style={[styles.errorText, errorStyle]}
                        ellipsizeMode="middle"
                        textBreakStrategy="highQuality"
                    >
                        {errorStr}
                    </Text>
                )}
            </View>

            <Dropdown
                style={[styles.dropdown, dropdownStyle, disabled && styles.disabledDropdown]}
                placeholderStyle={[styles.placeholderStyle, textStyle]}
                selectedTextStyle={[styles.selectedTextStyle, textStyle, disabled && styles.disabledText]}
                itemTextStyle={[styles.selectedTextStyle, textStyle]}
                data={data}
                maxHeight={250}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                value={value}
                onChange={handleSelect}
                disable={disabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    labelContainer: {
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
    dropdown: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        borderColor: COLORS.border,
        borderWidth: 1.5,
    },
    placeholderStyle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        color: COLORS.text.light,
    },
    selectedTextStyle: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
    },
    errorText: {
        fontFamily: "Josefin Sans",
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        paddingHorizontal: SPACING.xs,
        paddingVertical: SPACING.xs / 2,
        textAlign: "left",
        alignSelf: "flex-end",
    },
    disabledContainer: {
        opacity: 0.6,
    },
    disabledDropdown: {
        backgroundColor: COLORS.inputBackground,
    },
    disabledText: {
        color: COLORS.text.light,
    },
});
