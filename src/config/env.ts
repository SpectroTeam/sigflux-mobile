import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra;

if (!extra?.API_URL) {
    throw new Error("API_URL is missing");
}

export const ENV = {
    API_URL: extra.API_URL as string,
};
