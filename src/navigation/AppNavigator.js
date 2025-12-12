import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterUserScreen from '../screens/RegisterUserScreen';
import MainHeader from '../components/MainHeader';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
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
  );
}