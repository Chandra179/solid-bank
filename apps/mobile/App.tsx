import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./src/theme/global.css"; // NativeWind picks up Tailwind classes via this

import HomeScreen from "./src/screens/HomeScreen";
import PocketsScreen from "./src/screens/PocketsScreen";
import CardsScreen from "./src/screens/CardsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import PocketDetailScreen from "./src/screens/PocketDetailScreen";
import TransferScreen from "./src/screens/TransferScreen";
import TopUpScreen from "./src/screens/TopUpScreen";
import AmountEntryScreen from "./src/screens/AmountEntryScreen";
import ConfirmScreen from "./src/screens/ConfirmScreen";
import SuccessScreen from "./src/screens/SuccessScreen";

export type MoneyFlow = "transfer" | "topup";

// Shared params for the AmountEntry -> Confirm -> Success chain. Both the
// Transfer and Top Up entry points feed into this same three-screen tail,
// distinguished only by `flow` (see docs on why: shared amount/confirm/
// success UI, distinct destination/source pickers).
type MoneyMoveContext = {
  flow: MoneyFlow;
  contextId?: string;
  contextLabel: string;
  contextSubLabel?: string;
};

export type RootStackParamList = {
  Home: undefined;
  Pockets: undefined;
  Cards: undefined;
  Profile: undefined;
  PocketDetail: { pocketId: string };
  Transfer: undefined;
  TopUp: undefined;
  AmountEntry: MoneyMoveContext;
  Confirm: MoneyMoveContext & { amountMinor: number };
  Success: { flow: MoneyFlow; contextLabel: string; amountMinor: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Pockets" component={PocketsScreen} />
          <Stack.Screen name="Cards" component={CardsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="PocketDetail" component={PocketDetailScreen} />
          <Stack.Screen name="Transfer" component={TransferScreen} />
          <Stack.Screen name="TopUp" component={TopUpScreen} />
          <Stack.Screen name="AmountEntry" component={AmountEntryScreen} />
          <Stack.Screen name="Confirm" component={ConfirmScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} options={{ gestureEnabled: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
