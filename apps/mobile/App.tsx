import React from "react";
import { NavigationContainer, type NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./src/theme/global.css"; // NativeWind picks up Tailwind classes via this

import HomeScreen from "./src/screens/HomeScreen";
import PocketsScreen from "./src/screens/PocketsScreen";
import CardsScreen from "./src/screens/CardsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import PocketDetailScreen from "./src/screens/PocketDetailScreen";
import { IconCard, IconGrid, IconHome, IconProfile } from "./src/components/icons";
import { colors } from "./src/theme/colors";

export type TabParamList = {
  Home: undefined;
  Pockets: undefined;
  Cards: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  PocketDetail: { pocketId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand700,
        tabBarInactiveTintColor: colors.neutral400,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
        tabBarStyle: { borderTopColor: colors.neutral200 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <IconHome size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Pockets"
        component={PocketsScreen}
        options={{ tabBarIcon: ({ color, size }) => <IconGrid size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsScreen}
        options={{ tabBarIcon: ({ color, size }) => <IconCard size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <IconProfile size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="PocketDetail" component={PocketDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
