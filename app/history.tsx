import { H1, ScrollView, Separator, SizableText, Text, XStack, YStack, Spinner } from 'tamagui'
import { Container } from '../tamagui.config'
import { db } from '../db'
import { useEffect, useState } from 'react'
import { todos } from '../types/todos'
import { Stack } from 'expo-router'
import { DeleteButton } from '../components/DelteButton'
import Todo from '../components/Todo'

export default function history() {
  const [logs, setLogs] = useState<Record<string, todos>>({})
  const [isLoading, setIsLoading] = useState(true)

  const sortByTime = (data: todos) => {
    data.sort(function (a, b) {
      return a.time.localeCompare(b.time)
    })
    return data
  }

  const groupedByDate = (data: todos) => {
    let groupedData: Record<string, todos> = {}
    data.forEach((item) => {
      const dateKey = item.date

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = []
      }
      groupedData[dateKey].push(item)
    })
    return groupedData
  }

  const deleteAllLogs = () => {
    db.transaction((tx) => {
      tx.executeSql(`DELETE * FROM Todos;`, [])
    })
    setLogs({})
  }

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`select * from Todos;`, [], (txObj, { rows: { _array } }) => {
        const data = groupedByDate(sortByTime(_array))
        setLogs(data)
        setIsLoading(false)
      })
    })
  }, [logs])

  return (
    <ScrollView>
      <Stack.Screen options={{ headerRight: () => <DeleteButton deleteAll={deleteAllLogs} /> }} />
      <Container>
        <H1>History</H1>
        <YStack pt={15}>
          {isLoading ? (
            <Spinner size="large" color="#6366F1" />
          ) : (
            Object.entries(logs).map(([dateKey, todos]) => (
              <YStack key={dateKey}>
                <XStack gap="$2" alignItems="center" marginVertical={'$2'}>
                  <SizableText>{dateKey}</SizableText>
                  <Separator backgroundColor={'$gray12'} />
                </XStack>
                {todos.length == 0 && !isLoading && (
                  <YStack justifyContent="center" alignItems="center" pt="$3">
                    <Text color="$gray8" fontSize={22}>
                      No History
                    </Text>
                  </YStack>
                )}
                {todos.map(({ id, title, time, iscomplete }) => (
                  <Todo key={id} title={title} time={time} iscomplete={iscomplete} />
                ))}
              </YStack>
            ))
          )}
        </YStack>
      </Container>
    </ScrollView>
  )
}
