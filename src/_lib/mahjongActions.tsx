'use server'

import { createClient } from '@lib/supabase/server'
import { MahjongInformationProps } from '@type/mahjong'

export const getMahjongInformation = async () => {
  const response: {
    result: boolean
    message: string
    information: MahjongInformationProps[] | undefined
  } = {
    result: false,
    message: '',
    information: undefined,
  }
  try {
    const supabase = await createClient()
    const { data: mahjong_information, error } = await supabase
      .from('mahjong_information')
      .select('*')
      .order('order', { ascending: true })

    if (error || !mahjong_information) {
      throw new Error(
        error.message ?? 'Mahjong information not found. Check back later!',
      )
    }
    response.result = true
    response.message = 'Mahjong information found!'
    response.information = mahjong_information
  } catch (error: unknown) {
    response.message =
      error instanceof Error && error?.message !== ''
        ? error.message
        : 'Something happened. Check back later!'
    console.error(error)
  }

  return response
}
