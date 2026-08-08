/// <reference types="vite/client" />
// Web (Vite) equivalent of the "@env" module that react-native-dotenv
// generates for Metro. Aliased to "@env" in vite.config.ts.
export const API_BASE_URL = import.meta.env.API_BASE_URL as string;
