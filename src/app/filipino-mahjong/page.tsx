'use client'

import { useEffect, useState } from 'react'
import { Alert, CircularProgress, Stack, Typography } from '@mui/material'

import PageStackBasic from '@components/PageStackBasic'
import { processHtml } from '@lib/helpers'
import { getMahjongInformation } from '@lib/mahjongActions'
import { AlertMessageProps } from '@type/general'
import { MahjongInformationProps } from '@type/mahjong'

const Section = (props: { title: string; children?: React.ReactNode }) => {
  const { title, children } = props
  return (
    <Stack flexDirection={'column'} gap={2}>
      <Typography variant="h3">{title}</Typography>
      {children}
    </Stack>
  )
}

export default function Mahjong() {
  const [loading, setLoading] = useState(true)
  const [mahjongInformation, setMahjongInformation] =
    useState<MahjongInformationProps[]>()
  const [alertMessage, setAlertMessage] = useState<AlertMessageProps>()

  const initMahjong = async () => {
    try {
      const { result, message, information } = await getMahjongInformation()
      if (!result || !information || information.length === 0) {
        throw new Error(message)
      }
      setMahjongInformation(information)
      setLoading(false)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error?.message !== ''
          ? error.message
          : 'Something happened :( Check back later!'

      setAlertMessage({
        color: 'error',
        message: errorMessage,
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    initMahjong()
  }, [])

  return (
    <PageStackBasic>
      <Stack flexDirection={'column'} gap={3}>
        <Typography variant="h1" textAlign={'center'}>
          Filipino Mahjong
        </Typography>
        {loading && (
          <Stack padding={5} alignItems={'center'}>
            <CircularProgress color="primary" />
          </Stack>
        )}
        {alertMessage && (
          <Stack alignItems={'center'}>
            <Alert variant="filled" color={alertMessage.color}>
              {alertMessage.message}
            </Alert>
          </Stack>
        )}
        <Stack flexDirection={'column'} gap={5}>
          {mahjongInformation &&
            mahjongInformation.map((info, index) => (
              <Section key={index} title={info.title}>
                {processHtml(info.description)}
              </Section>
            ))}
        </Stack>
      </Stack>
    </PageStackBasic>
  )
}
