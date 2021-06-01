import TelegramBot, { Message } from "node-telegram-bot-api"
import { User } from "@entities"
import { logger } from "@utils"

export const handleRemoveCommand = async (
  bot: TelegramBot,
  { chat, from }: Message
) => {
  const user = await User.findOne(chat.id, { relations: ["districts"] })

  if (!user) {
    const message = `Sorry ${from?.first_name}, You are not yet subscribed.`
    return bot.sendMessage(chat.id, message)
  }

  let message = `Hey ${from?.first_name}
You have not subscribed for any districts yet.`

  if (user.districts && user.districts.length > 0) {
    const exampleDistrict =
      user.districts[Math.floor(Math.random() * user.districts.length)]

    message = `Hey ${from?.first_name}
      
You have signed up for these districts - 
${user.districts?.map(({ id, name }) => `${id} - ${name}`).join("\n")}
   
For removing one district from these reply the district's id prefixed with "-"

For example, to remove ${exampleDistrict.name}, reply 
-D${exampleDistrict.id}

For removing more than one district, reply the district's ids prefixed with "-" in new lines.

For example, 
-D${exampleDistrict.id}
-D${exampleDistrict.id + 1}
-D${exampleDistrict.id + 2}`
  }

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
