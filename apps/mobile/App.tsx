import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./src/theme/global.css"; // NativeWind picks up Tailwind classes via this

import HomeScreen from "./src/screens/HomeScreen";
import PocketDetailScreen from "./src/screens/PocketDetailScreen";

export type RootStackParamList = {
  Home: undefined;
  PocketDetail: { pocketId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PocketDetail" component={PocketDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
