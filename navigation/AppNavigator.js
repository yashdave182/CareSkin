import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // Changed from native-stack
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screen imports
import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import DiseasePredictScreen from '../screens/DiseasePredictScreen';
import HealthInputScreen from '../screens/HealthInputScreen';
import DiabetesPredictScreen from '../screens/DiabetesPredictScreen';
import Profiles from '../screens/Profiles';
import PneumoniaPredictScreen from '../screens/PneumoniaPredictScreen';
import LungCancerPredictScreen from '../screens/LungCancerPredictScreen';
import HypertensionPredictScreen from '../screens/HypertensionPredictScreen';
import CKDPredictScreen from '../screens/CKDPredictScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Changed from createNativeStackNavigator

// Scanner Stack Navigator
const ScannerStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen 
        name="ScannerMain" 
        component={ScannerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DiseasePredict" 
        component={DiseasePredictScreen}
        options={{ 
          headerShown: true,
          title: 'Disease Prediction',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <Stack.Screen 
        name="DiabetesPredict" 
        component={DiabetesPredictScreen}
        options={{ 
          headerShown: true,
          title: 'Diabetes Prediction',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <Stack.Screen 
        name="pneumonia" 
        component={PneumoniaPredictScreen}
        options={{ 
          headerShown: true,
          title: 'Pneumonia Prediction',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <Stack.Screen 
        name="LungCancer" 
        component={LungCancerPredictScreen}
        options={{ 
          headerShown: true,
          title: 'Lung Cancer Prediction',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <Stack.Screen 
  name="HypertensionPredict" 
  component={HypertensionPredictScreen}
  options={{ 
    headerShown: true,
    title: 'Hypertension Risk Assessment'
  }}
/>
<Stack.Screen 
  name="CKDPredict" 
  component={CKDPredictScreen}
  options={{ 
    headerShown: true,
    title: 'CKD Assessment'
  }}
/>
    </Stack.Navigator>
  );
};

// Tab configuration
const tabOptions = {
  Home: {
    icon: 'home-heart',
    label: 'Home',
    color: '#0092FF',
  },
  Scanner: {
    icon: 'scan-helper',
    label: 'Scanner',
    color: '#00C853',
  },
  HealthInput: {
    icon: 'clipboard-pulse',
    label: 'Health',
    color: '#FFB300',
  },
  Profiles: {
    icon: 'account',
    label: 'Profile',
    color: '#1976D2',
  },
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const screenConfig = tabOptions[route.name];
          return (
            <View style={styles.tabIconContainer}>
              <MaterialCommunityIcons
                name={screenConfig.icon}
                size={24}
                color={focused ? screenConfig.color : '#666'}
              />
              {focused && (
                <View
                  style={[styles.dot, { backgroundColor: screenConfig.color }]}
                />
              )}
            </View>
          );
        },
        tabBarLabel: tabOptions[route.name]?.label,
        tabBarActiveTintColor: tabOptions[route.name]?.color,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        safeAreaInsets: { bottom: 0 },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="HealthInput"
        component={HealthInputScreen}
        options={{ title: 'Health Input' }}
      />
      <Tab.Screen
        name="Profiles"
        component={Profiles}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 75 : 60,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    elevation: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: Platform.OS === 'ios' ? 0 : -4,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 50,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  header: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    height: Platform.OS === 'ios' ? 90 : 70,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});