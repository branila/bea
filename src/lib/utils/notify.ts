import { Telegraf } from 'telegraf'
import { BOT_TOKEN } from '$env/static/private'
import { adminChatIds } from '$lib/server/config'

const bot = new Telegraf(BOT_TOKEN)

export default async function notify(message: string) {
  for (const id of adminChatIds) {
    const [error] = await goCatch(bot.telegram.sendMessage(id, message))

    if (error) {
      console.error(`Failed to send message to ${id} - ${error.message}`)
    }
  }
}
