import TelegramBot, { Message } from "node-telegram-bot-api"

export const handleAnyCommand = (bot: TelegramBot, { from, chat }: Message) => {
  return bot.sendMessage(chat.id, `Hey ${from?.first_name}`)
}
