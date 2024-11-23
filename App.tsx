import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './context/UserContext'; 
import HomeScreen from './pages/HomeScreen';
import ProfileScreen from './pages/ProfileScreen';
import RegisterScreen from './pages/RegisterScreen';
import SearchScreen from './pages/SearchScreen';
import Menu from './pages/Menu';
import BookScreen from './pages/BookScreen';
import ReadBookScreen from './pages/ReadBookScreen';
import SignInScreen from './pages/SignInScreen';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, scheduleNotification } from './service/NotificationService';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });
    return () => {
      subscription.remove();
    };
  }, []);
  
  const handleScheduleNotification = () => {
    scheduleNotification('Important event', 'Be the first to receive reminders');
  };

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <UserProvider>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ 
            headerStyle: { backgroundColor: '#2d241b' }, 
            headerTintColor: '#f1f0e5', 
            headerTitleStyle: { fontWeight: 'bold' },
          }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="BookScreen" component={BookScreen} options={{ title: 'Book' }} />
            <Stack.Screen name="ReadBookScreen" component={ReadBookScreen} /> 
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
          </Stack.Navigator>
          <Menu /> 
        </UserProvider>
      </NavigationContainer>
    </I18nextProvider>
  );
}
