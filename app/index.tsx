import moment from 'moment'
import { Button, H1, Separator, Spinner, Text, XStack, YStack } from 'tamagui'
import { ButtonText, Container } from '../tamagui.config'
import Todo from '../components/Todo'
import { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { Sheet } from '@tamagui/sheet'
import { AddTodo } from '../components/AddTodo'
import { db } from '../db'
import { todos } from '../types/todos'
import * as Haptics from 'expo-haptics'
import { Day } from '../types/day'

export default function Page() {
  const today = moment().format('MMMM D, YYYY')
  const yesterday = moment().add(-1, 'days').format('MMMM D, YYYY')
  const tomorrow = moment().add(1, 'days').format('MMMM D, YYYY')
  const [day, SetDay] = useState<Day>({ name: 'Today', date: today })

  const [todos, SetTodos] = useState<todos>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const sortByTime = (data: todos) => {
    data.sort(function (a, b) {
      return a.time.localeCompare(b.time)
    })
    return data
  }

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'create table if not exists Todos (id INTEGER primary key not null, title TEXT, date TEXT, time TEXT, iscomplete INTEGER);'
      )
    })

    db.transaction((tx) => {
      tx.executeSql(
        `select * from Todos WHERE date = ?;`,
        [day.date],
        (txObj, { rows: { _array } }) => {
          const data = sortByTime(_array as todos)
          SetTodos(data)
          setIsLoading(false)
        }
      )
    })
  }, [todos])

  return (
    <>
      <Container>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <H1>{day.name}</H1>
            <Text ml={'$2'} color={'$gray10'}>
              {day.date}
            </Text>
          </YStack>
          <XStack gap="$2">
            <Button
              circular
              size={'$3'}
              borderRadius={14}
              backgroundColor={day.date === yesterday ? '$gray4' : 'white'}
              disabled={day.date === yesterday}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                if (day.date === today) {
                  SetDay({ name: 'Yesterday', date: yesterday })
                } else {
                  SetDay({ name: 'Today', date: today })
                }
              }}>
              <Feather
                name="chevron-left"
                size={20}
                color={day.date === yesterday ? 'gray' : 'black'}
              />
            </Button>
            <Button
              circular
              size={'$3'}
              borderRadius={14}
              backgroundColor={day.date === tomorrow ? '$gray4' : 'white'}
              disabled={day.date === tomorrow}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                if (day.date === today) {
                  SetDay({ name: 'Tomorrow', date: tomorrow })
                } else {
                  SetDay({ name: 'Today', date: today })
                }
              }}>
              <Feather
                name="chevron-right"
                size={20}
                color={day.date === tomorrow ? 'gray' : 'black'}
              />
            </Button>
          </XStack>
        </XStack>
        <Separator marginVertical={15} backgroundColor={'$gray12'} />
        {todos.length == 0 && !isLoading && (
          <YStack justifyContent="center" alignItems="center" pt="$3">
            <Text color="$gray8" fontSize={22}>
              No todo's {day.name}
            </Text>
          </YStack>
        )}
        {isLoading ? (
          <Spinner size="large" color="#6366F1" />
        ) : (
          <FlashList
            data={todos as todos}
            renderItem={({ item: { title, date, time, iscomplete, id } }) => (
              <Todo
                yesterday={yesterday}
                title={title}
                date={date}
                time={time}
                iscomplete={iscomplete}
                onPress={() => {
                  if (date != yesterday) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    db.transaction((tx) => {
                      tx.executeSql(
                        `update Todos set iscomplete = ${iscomplete ? '0' : '1'} where id = ?;`,
                        [id as number]
                      )
                    })
                  }
                }}
                onLongPress={() => {
                  Haptics.selectionAsync()
                  db.transaction((tx) => {
                    tx.executeSql(`DELETE FROM Todos WHERE id = ?;`, [id as number])
                  })
                }}
                MovetoToday={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                  db.transaction((tx) => {
                    tx.executeSql(`update Todos set date = ? where id = ?;`, [today, id as number])
                  })
                }}
              />
            )}
            estimatedItemSize={250}
            showsVerticalScrollIndicator={false}
          />
        )}
        {day.date != yesterday && (
          <Button
            circular
            position="absolute"
            backgroundColor={'#6366F1'}
            bottom={'$5'}
            right={'$5'}
            borderRadius={14}
            size={'$5'}
            pressStyle={{ backgroundColor: '#5a5fcf' }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              setOpen(!open)
            }}>
            <ButtonText>
              <Feather name="plus" size={28} />
            </ButtonText>
          </Button>
        )}
      </Container>
      <Sheet
        modal
        forceRemoveScrollEnabled={open}
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="percent"
        snapPoints={[40]}
        zIndex={100_000}
        animation="bouncy">
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Frame padding="$4">
          <AddTodo close={() => setOpen(false)} day={day} />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
