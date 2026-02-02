import { FONT_SIZES, SPACING } from "../../themes/tokens";
import DropdownComponent from "../common/DropdownComponent";

type AcompanhanteDropdownProps = {
    value?: string;
    onSelect?(value: string): void;
};

export function AcompanhanteDropdown({ value, onSelect }: AcompanhanteDropdownProps) {
    return (
        <DropdownComponent
            label="Acompanhante:"
            dropdownStyle={{ paddingVertical: SPACING.sm }}
            data={[
                { label: "Jose Maria de Barros", value: "1" },
                { label: "Ana Paula Silva", value: "2" },
            ]}
            value={value ?? ""}
            placeholder="Escolher acompanhante"
            onSelect={onSelect ?? (() => {})}
            labelStyle={{
                fontFamily: "Josefin Sans-Bold",
                fontSize: FONT_SIZES.md,
                marginLeft: 0,
            }}
        />
    );
}
