import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import RegisterUserScreen from './src/screens/RegisterUserScreen';
import MainHeader from './src/components/MainHeader'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          header: (props) => <MainHeader {...props} />,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />

        <Stack.Screen 
          name="RegisterUser" 
          component={RegisterUserScreen} 
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}