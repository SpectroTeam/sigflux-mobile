import { FONT_SIZES, SPACING } from "../../themes/tokens";
import DropdownComponent from "../common/DropdownComponent";
import { usePacienteById } from "../../hooks/usePacientes";

type AcompanhanteDropdownProps = {
    value?: string;
    onSelect?(value: string): void;
    pacienteId?: string;
};

export function AcompanhanteDropdown({ value, onSelect, pacienteId }: AcompanhanteDropdownProps) {
    const { data: paciente } = usePacienteById(pacienteId || "");

    const acompanhantesData =
        paciente?.acompanhantes?.map((acompanhante) => ({
            label: `${acompanhante.nome} (${acompanhante.parentesco})`,
            value: acompanhante.id,
        })) || [];

    // Adicionar opção "Sem acompanhante"
    const data = [{ label: "Sem acompanhante", value: "" }, ...acompanhantesData];

    return (
        <DropdownComponent
            label="Acompanhante:"
            dropdownStyle={{ paddingVertical: SPACING.sm }}
            data={data}
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
