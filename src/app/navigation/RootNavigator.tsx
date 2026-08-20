import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../AppProvider';
import { colors } from '../../theme';
import { PrimaryTabBar } from '../../components/PrimaryTabBar';
import { SplashScreen } from '../../screens/SplashScreen';
import { WelcomeScreen } from '../../screens/onboarding/WelcomeScreen';
import { ComfortScreen } from '../../screens/onboarding/ComfortScreen';
import { GoalScreen } from '../../screens/onboarding/GoalScreen';
import { ReminderScreen } from '../../screens/onboarding/ReminderScreen';
import { TodayScreen } from '../../screens/TodayScreen';
import { PlaceholderScreen } from '../../screens/PlaceholderScreen';
import { LoginScreen } from '../../screens/LoginScreen';
import { PathScreen } from '../../screens/PathScreen';
import { ChallengeDetailScreen } from '../../screens/ChallengeDetailScreen';
import { RecordingScreen } from '../../screens/RecordingScreen';
import { TakeAcceptedScreen } from '../../screens/TakeAcceptedScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
    primary: colors.primary,
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <PrimaryTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'none',
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Path" component={PathScreen} />
      <Tab.Screen name="Progress">
        {() => (
          <PlaceholderScreen
            title="Keep showing up."
            subtitle="Server-backed trends and weekly progress arrive with Milestone 4."
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Me">
        {() => (
          <PlaceholderScreen
            title="Your profile"
            subtitle="Badges and settings arrive with Milestone 4."
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { loading, user } = useApp();
  if (loading) return <SplashScreen />;
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.onboardingComplete ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="ChallengeDetail"
              component={ChallengeDetailScreen}
            />
            <Stack.Screen name="Recording" component={RecordingScreen} />
            <Stack.Screen
              name="TakeAccepted"
              component={TakeAcceptedScreen}
              options={{ gestureEnabled: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Comfort" component={ComfortScreen} />
            <Stack.Screen name="Goal" component={GoalScreen} />
            <Stack.Screen name="Reminder" component={ReminderScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
