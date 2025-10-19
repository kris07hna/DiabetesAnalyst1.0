import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { modelRunner } from '../lib/onnxModel';
import '../global.css';

export default function RootLayout() {
  // Preload model on app start
  useEffect(() => {
    modelRunner.loadModel().catch(console.error);
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f172a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
