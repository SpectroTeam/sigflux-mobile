// load environment variables from .env file and make them available in the Expo app
import "dotenv/config";

export default ({ config }) => ({
    ...config,
    extra: {
        API_URL: process.env.API_URL,
    },
});
