import { Link } from 'expo-router'
import { XStack, YStack, Text, Paragraph, Avatar, ScrollView } from 'tamagui'
import * as Haptics from 'expo-haptics'

import { Container, Subtitle, Title } from '../tamagui.config'

export default function Details() {
  return (
    <ScrollView>
      <Container pt="$2">
        <YStack pb="$2">
          <XStack alignItems="flex-end">
            <Title>Dox</Title>
            <Text color={'$blue1'}>Beta</Text>
          </XStack>
          <Subtitle>Elevate Your Productivity with Effortless Task Management.</Subtitle>
        </YStack>
        <YStack paddingVertical="$4" gap="$2">
          <Text fontSize={16} fontWeight={'600'} color="#38434D">
            Made by:
          </Text>
          <YStack alignItems="center" gap="$2">
            <Link href="https://github.com/MYB320" onPress={() => Haptics.selectionAsync()}>
              <Avatar circular size="$15">
                <Avatar.Image src="https://avatars.githubusercontent.com/MYB320" />
                <Avatar.Fallback bc="myb" />
              </Avatar>
            </Link>
            <XStack alignItems="flex-end">
              <Text fontSize={20}>Mohamed Yasser Boureghida</Text>
              <Text fontSize={10} fontWeight={'600'} color="#38434D">
                (myb320)
              </Text>
            </XStack>
          </YStack>
        </YStack>
        <YStack>
          <Text fontSize={16} fontWeight={'600'} color="#38434D">
            Description:
          </Text>
          <Paragraph color="#38434D">
            "Dox" is a cutting-edge to-do application currently in its beta version. This innovative
            productivity tool is designed to help users efficiently manage their tasks and stay
            organized. With an intuitive user interface and a range of features, Dox allows users to
            create, prioritize, and track their to-do lists seamlessly. The beta version offers a
            sneak peek into the application's capabilities, providing users with an opportunity to
            experience its functionality and contribute feedback for further improvements. Stay
            tuned for the official release to enjoy a streamlined and powerful solution for tackling
            your daily tasks with Dox.
          </Paragraph>
        </YStack>
      </Container>
    </ScrollView>
  )
}
