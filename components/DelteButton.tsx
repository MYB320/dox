import { AlertDialog, Button, XStack, YStack } from 'tamagui'
import * as Haptics from 'expo-haptics'
import { Feather } from '@expo/vector-icons'

export function DeleteButton({ deleteAll }: { deleteAll: () => void }) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        <Button
          unstyled
          paddingHorizontal="$2"
          pressStyle={{ opacity: 0.1 }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }}
          icon={<Feather name="trash" color="red" size={18} />}></Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}>
          <YStack space>
            <AlertDialog.Title>Delete All</AlertDialog.Title>

            <AlertDialog.Description>
              Do you accept clearing all the log history
            </AlertDialog.Description>
            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild>
                <Button
                  theme="red"
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                    deleteAll()
                  }}>
                  Accept
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}
