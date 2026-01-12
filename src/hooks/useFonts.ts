import { useFonts as useExpoFonts } from "expo-font";
import { JosefinSans_400Regular, JosefinSans_700Bold } from "@expo-google-fonts/josefin-sans";
import { TiltWarp_400Regular } from "@expo-google-fonts/tilt-warp";

export function useFonts() {
    const [fontsLoaded] = useExpoFonts({
        "Josefin Sans": JosefinSans_400Regular,
        "Josefin Sans-Bold": JosefinSans_700Bold,
        "Tilt Warp": TiltWarp_400Regular,
    });

    return fontsLoaded;
}
