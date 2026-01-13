export const COLORS = {
    primary: "#281919",
    background: "#f2f2f2",
    secondary: "#EA0202",
    inputBackground: "#F1F1F1",
    link: "#0003c6",
    surface: "#FFFFFF",
    text: {
        primary: "#1A1A1A",
        secondary: "#6A4C4C",
        light: "#9CA3AF",
    },
    border: "#E5E7EB",
    error: "#EF4444",
    success: "#00C684",
    warning: "#F59E0B",
    info: "#3B82F6",
} as const;

export const FONTS = {
    tiltWarp: {
        family: "Tilt Warp",
    },
    josefinSans: {
        family: "Josefin Sans",
    },
} as const;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
    xxxxl: 56,
};

export const FONT_SIZES = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
};

export const ICON_SIZES = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
};

export const LOGO_SIZES = {
    sm: 100,
    md: 150,
    lg: 200,
    xl: 250,
};

export const BORDER_RADIUS = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xll: 20,
    xxl: 32,
    huge: 56,
    round: 9999,
};

export const AVATAR_SIZES = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
    xxl: 128,
    large: 150,
};

export const SHADOWS = {
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 12,
    },
    xl: {
        shadowColor: "#000",
        shadowOffset: { width: 8, height: 24 },
        shadowOpacity: 0.9,
        shadowRadius: 16,
        elevation: 32,
    },
};
