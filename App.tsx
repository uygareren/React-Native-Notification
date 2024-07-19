import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, Linking, PermissionsAndroid } from 'react-native';
import AdDetailScreen from './screens/AdDetailScreen';
import AdScreen from './screens/AdScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();
const NAVIGATION_IDS = ["home", "settings", "ad", "adDetail"];

// Özel URL şeması öneki
const URL_PREFIX = 'notification://'; 

function buildDeepLinkFromNotificationData(data: any): string | null {
  const navigationId = data?.navigationId;
  const id = data?.id;

  console.log('Received Notification Data:', data); // Debugging için

  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }

  if (navigationId === "home") {
    return `${URL_PREFIX}home`;
  }
  if (navigationId === "settings") {
    return `${URL_PREFIX}settings`;
  }
  if (navigationId === "ad") {
    return `${URL_PREFIX}ad`;
  }
  if (navigationId === "adDetail") {
    return `${URL_PREFIX}adDetail/${id}`; // `ad` ekranını da ekliyoruz
  }

  return null;
}

const linking = {
  prefixes: [URL_PREFIX],
  config: {
    screens: {
      Home: "home",
      Settings: "settings",
      Ad: "ad",
      AdDetail: "adDetail/:id" // ID parametresi ekleyin
    }
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    // getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    console.log('Initial Notification:', message); // Debugging için
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
    return null; // Eğer URL yoksa null döndürün
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const foreground = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
    });

    // onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification Opened:', remoteMessage); // Debugging için
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (typeof url === 'string') {
        listener(url);
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
      foreground();
    };
  },
}

function App(): React.JSX.Element {

  useEffect(() => {
    const requestUserPermission = async () => {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        console.log('FCM token:', token);
      }
    };

    requestUserPermission();
  }, [])

  return (
    <NavigationContainer linking={linking} fallback={<ActivityIndicator animating />}>
      <Stack.Navigator >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Ad" component={AdScreen} />
        <Stack.Screen name="AdDetail" component={AdDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
