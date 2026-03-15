import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import LivestockScreen from "./screens/LivestockScreen";
import LivestockEventScreen from "./screens/LivestockEventScreen";
import MarketScreen from "./screens/MarketScreen";
import AddMarketScreen from "./screens/AddMarketScreen";
import FinanceScreen from "./screens/FinanceScreen";
import AddFinanceScreen from "./screens/AddFinanceScreen";
import AlertsScreen from "./screens/AlertsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MarketStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MarketList" component={MarketScreen} options={{ title: "Зах зээл" }} />
      <Stack.Screen name="AddMarket" component={AddMarketScreen} options={{ title: "Зар нэмэх" }} />
    </Stack.Navigator>
  );
}

function LivestockStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LivestockMain" component={LivestockScreen} options={{ title: "Малын бүртгэл" }} />
      <Stack.Screen name="LivestockEvent" component={LivestockEventScreen} options={{ title: "Үйл явдал" }} />
    </Stack.Navigator>
  );
}

function FinanceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FinanceMain" component={FinanceScreen} options={{ title: "Санхүү" }} />
      <Stack.Screen name="AddFinance" component={AddFinanceScreen} options={{ title: "Бүртгэл нэмэх" }} />
    </Stack.Navigator>
  );
}

function getTabIcon(name) {
  const icons = {
    "Нүүр": "🏠",
    "Мал": "🐑",
    "Зах": "🛒",
    "Санхүү": "💰",
    "Аюул": "⚠️",
  };
  return icons[name] || "📱";
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => (
            <Text style={{ fontSize: 24 }}>{getTabIcon(route.name)}</Text>
          ),
          tabBarLabelStyle: { fontSize: 12 },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Нүүр" component={HomeScreen} />
        <Tab.Screen name="Мал" component={LivestockStack} />
        <Tab.Screen name="Зах" component={MarketStack} />
        <Tab.Screen name="Санхүү" component={FinanceStack} />
        <Tab.Screen name="Аюул" component={AlertsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
