import { Feather } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { Stack, useRouter, SplashScreen } from 'expo-router'
import React, { useEffect } from 'react'
import { TamaguiProvider, Button, Text, Theme } from 'tamagui'
import * as Haptics from 'expo-haptics'

import config from '../tamagui.config'
import { XStack } from 'tamagui'

SplashScreen.preventAutoHideAsync()

export default function Layout() {
  const router = useRouter()

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) return null

  const BackButton = () => (
    <Button
      unstyled
      pressStyle={{ opacity: 0.1 }}
      paddingHorizontal="$2"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.back()
      }}
      icon={<Feather name="arrow-left" size={18} />}></Button>
  )

  const DetailsButton = () => (
    <Button
      unstyled
      paddingHorizontal="$2"
      pressStyle={{ opacity: 0.1 }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.push('/details')
      }}
      icon={<Feather name="info" size={18} />}></Button>
  )
  const HistoryButton = () => (
    <Button
      unstyled
      paddingHorizontal="$2"
      pressStyle={{ opacity: 0.1 }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.push('/history')
      }}
      icon={<Feather name="list" size={18} />}></Button>
  )

  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: 'DoX',
              headerRight: () => (
                <XStack gap="$2">
                  <HistoryButton />
                  <DetailsButton />
                </XStack>
              ),
            }}
          />
          <Stack.Screen
            name="details"
            options={{
              title: 'Details',
              headerLeft: () => <BackButton />,
            }}
          />
          <Stack.Screen
            name="history"
            options={{
              title: 'History',
              headerLeft: () => <BackButton />,
            }}
          />
        </Stack>
      </Theme>
    </TamaguiProvider>
  )
}
