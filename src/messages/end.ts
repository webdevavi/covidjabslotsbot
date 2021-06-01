import { User } from "@entities"
import { logger } from "@utils"
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

  return bot.sendMessage(chat.id, message).catch((error) => {
    if (
      error.response?.body?.description?.includes("bot was blocked by the user")
    ) {
      User.delete({ chatId: chat.id })
    }

    return logger.error(
      `Failed to send message to chat ${chat.id}; ${error.response?.body?.description}`
    )
  })
}
