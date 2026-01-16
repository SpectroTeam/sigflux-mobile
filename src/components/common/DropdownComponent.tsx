import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../../themes/tokens";

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
};

export default function DropdownComponent({
    label,
    data,
    onSelect,
    placeholder = "Select Item",
    value,
    errorStr,
}: DropdownComponentProps) {
    function handleSelect(item: { label: string; value: string }) {
        onSelect?.(item.value);
    }

    return (
        <View>
            <View style={styles.labelContainer}>
                {label && <Text style={styles.label}>{label}</Text>}
                {errorStr && (
                    <Text style={styles.errorText} ellipsizeMode="middle" textBreakStrategy="highQuality">
                        {errorStr}
                    </Text>
                )}
            </View>

            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.selectedTextStyle}
                data={data}
                maxHeight={250}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                value={value}
                onChange={handleSelect}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
    dropdown: {
        borderBottomColor: "gray",
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        borderColor: COLORS.border,
        borderBottomWidth: 0.5,
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
