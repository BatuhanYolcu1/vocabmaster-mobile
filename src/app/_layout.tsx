import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true, shouldShowBanner: true, shouldShowList: true }),
});

export default function RootLayout() {
  useEffect(() => { Notifications.requestPermissionsAsync(); }, []);
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" options={{ animation: 'none', gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="study/flashcard" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="study/select" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="study/quiz" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="study/typing"   options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="study/speaking" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="words/[listId]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="words/detail" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="words/add" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="words/new-list" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="settings/notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings/privacy" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings/help" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({ root: { flex: 1 } });
