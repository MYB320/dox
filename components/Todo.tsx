import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { Text, H6, Card, XStack, Button } from 'tamagui'

type TodoProps = {
  title: string
  date?: string
  time: string
  iscomplete: boolean
  yesterday?: string
  onPress?: () => void
  onLongPress?: () => void
  MovetoToday?: () => void
}

const Todo = ({
  yesterday,
  title,
  date,
  time,
  iscomplete,
  onPress,
  onLongPress,
  MovetoToday,
}: TodoProps) => {
  const [press, setPress] = useState<boolean>(false)
  return (
    <Card
      borderWidth={0.1}
      borderRadius={14}
      backgroundColor={press ? '$red10' : iscomplete ? '$gray4' : 'white'}
      onPress={onPress}
      onLongPress={() => {
        onLongPress && setPress(true)
        onLongPress && setTimeout(() => setPress(false), 1000)
        onLongPress && onLongPress()
      }}
      marginVertical={'$1.5'}>
      <Card.Header>
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap={'$2'} alignItems="center">
            <Feather
              name={iscomplete ? 'check-circle' : 'circle'}
              color={press ? 'white' : iscomplete ? 'gray' : 'black'}
              size={18}
            />
            <H6
              textDecorationLine={iscomplete ? 'line-through' : 'none'}
              color={press ? 'white' : iscomplete ? '$gray10' : 'black'}>
              {title}
            </H6>
          </XStack>
          <XStack gap={'$2'}>
            <XStack justifyContent="space-between" alignItems="center" gap="$1">
              <Feather
                name="clock"
                color={press ? 'white' : iscomplete ? 'gray' : 'black'}
                size={12}
              />
              <Text color={press ? 'white' : iscomplete ? '$gray10' : 'black'}>{time}</Text>
            </XStack>
            {date && date === yesterday && !iscomplete && (
              <Button
                circular
                size={'$1.5'}
                borderRadius={14}
                disabled={iscomplete}
                backgroundColor={press ? '$red10' : iscomplete ? '$gray1' : '$gray4'}
                onPress={MovetoToday}>
                <Feather
                  name="arrow-right"
                  color={press ? 'white' : iscomplete ? 'gray' : 'black'}
                  size={14}
                />
              </Button>
            )}
          </XStack>
        </XStack>
      </Card.Header>
    </Card>
  )
}

export default Todo
