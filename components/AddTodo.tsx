import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import moment from 'moment'
import { H2, Label, Input, YStack, Checkbox, XStack, Text, Form, Spinner, Button } from 'tamagui'
import { ButtonText } from '../tamagui.config'
import * as Haptics from 'expo-haptics'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { db } from '../db'
import { Platform, KeyboardAvoidingView } from 'react-native'
import { Day } from '../types/day'

type addTodoProps = { close: () => void; day: Day }

export const AddTodo = ({ close, day }: addTodoProps) => {
  const [title, setTitle] = useState<string>('')
  const [TitleError, setTitleError] = useState<string | null>(null)
  const [date, setDate] = useState<Date>(new Date())
  const [iscomplete, setIscomplete] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [loading, SetLoading] = useState<boolean>(false)

  const time = moment(date).format('HH:mm')

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, SelectedDate) => setDate(SelectedDate as Date),
      mode: 'time',
      is24Hour: true,
    })
  }

  const AddNewTodo = () => {
    if (title.trim() === '') {
      setTitleError('To Do required')
    } else {
      SetLoading(true)
      try {
        db.transaction((tx) => {
          tx.executeSql('insert into Todos (title, date, time, iscomplete) values (?, ?, ?, ?)', [
            title,
            day.date,
            time,
            Number(iscomplete),
          ])
        })
      } catch {
        console.log('err')
      } finally {
        SetLoading(false)
        setTitle('')
        setDate(new Date())
        setIscomplete(false)
        setTitleError(null)
      }
      close()
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, justifyContent: 'space-between' }}>
      <H2 pb="$4">Add Todo</H2>
      <Form onSubmit={AddNewTodo}>
        <YStack gap="$3" pb="$6">
          <YStack>
            <Label fontSize={17} htmlFor="title">
              To Do
            </Label>
            <Input
              id="title"
              value={title}
              onChangeText={(text) => setTitle(text)}
              disabled={loading}
            />
            {TitleError != null && <Text color="$red10">{TitleError}</Text>}
          </YStack>
          <YStack>
            <Label fontSize={17} htmlFor="time">
              Time
            </Label>
            <Button
              backgroundColor={'$backgroundTransparent'}
              borderColor="$gray9"
              borderWidth={0.2}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                showMode()
              }}
              disabled={loading}>
              <XStack>
                <XStack p="$3" justifyContent="center" alignItems="center" gap="$1">
                  <Feather name="calendar" />
                  <Text>{day.name}</Text>
                </XStack>
                <XStack p="$3" justifyContent="center" alignItems="center" gap="$1">
                  <Feather name="clock" />
                  <Text>{time}</Text>
                </XStack>
              </XStack>
            </Button>
          </YStack>
          <XStack alignItems="center" gap="$2">
            <Checkbox
              id="iscomplete"
              size="$5"
              checked={iscomplete}
              onCheckedChange={(checked: boolean) => setIscomplete(checked)}
              disabled={loading}>
              <Checkbox.Indicator>
                <Feather name="check" />
              </Checkbox.Indicator>
            </Checkbox>
            <Label fontSize={17} htmlFor="iscomplete" color={iscomplete ? '$green10' : 'black'}>
              Completed
            </Label>
          </XStack>
        </YStack>
        <Form.Trigger asChild>
          <Button
            backgroundColor={'#6366F1'}
            pressStyle={{ backgroundColor: '#5a5fcf' }}
            disabled={loading}
            onPress={() => Haptics.selectionAsync()}>
            {loading ? <Spinner /> : <ButtonText>Add Todo</ButtonText>}
          </Button>
        </Form.Trigger>
      </Form>
    </KeyboardAvoidingView>
  )
}
