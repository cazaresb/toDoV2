import React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Screens/LoginScreen';
import TaskScreen from './Screens/TaskScreen';
import { useFonts } from 'expo-font';
import ManageScreen from './Screens/ManageScreen';


const Stack = createNativeStackNavigator();

global.isSignedIn = false;

export default function App() {
  const [fontsLoaded] = useFonts({
    Asap: require('./assets/fonts/Asap-VariableFont.ttf'),
    Segoe: require('./assets/fonts/Segoe-UI.ttf'),
    SegoeBold: require('./assets/fonts/SegoeUIBold.ttf'),
  })
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
      <Stack.Screen name="Task Screen" options={{headerShown: false}}component={TaskScreen} />
      <Stack.Screen name="Manage Screen" options={{headerShown: false}}component={ManageScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// This app attempts to recreate the functionality of a simple To Do app (inspiration from Microsoft ToDo)
// has more than 3 screens, code is seperated into different files and communicate with eachother
// many new things implemented, notably: Firebase authentication, Firestore Database, React Navigation,
// expo UseFonts, Custom Icons, Display, among many other things not taught during curriculum.
// BIG IDEA: Implementation of Firebase