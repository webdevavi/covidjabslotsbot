import { User } from "@entities"
import TelegramBot, { Message } from "node-telegram-bot-api"

export const handleEndCommand = async (
  bot: TelegramBot,
  { from, chat }: Message
) => {
  const user = await User.findOne(chat.id)

  if (!user) {
    const message = `Hey ${from?.first_name}, You are not yet subscribed.`
    return bot.sendMessage(chat.id, message)
  }

  await user.remove()

  const message = `Hey ${from?.first_name}

Looks like you booked your slot.

Thanks for using this bot, we are very happy if we could help you.

Since you have ended your subscription, we won't be sending you any notifications from now on.`

  return bot.sendMessage(chat.id, message)
}
