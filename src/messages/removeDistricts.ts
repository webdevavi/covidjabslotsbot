import TelegramBot, { Message } from "node-telegram-bot-api"
import { User } from "@entities"

export const handleRemoveDistrictsCommand = async (
  bot: TelegramBot,
  { chat, from, text }: Message
) => {
  const districtIds = text?.split("\n").map((txt) => parseInt(txt.substring(2)))

  const user = await User.findOne(chat.id, { relations: ["districts"] })

  if (!user) {
    const message = `Sorry ${from?.first_name}, You are not yet subscribed.`
    return bot.sendMessage(chat.id, message)
  }

  let message = `Hey ${from?.first_name}
You have not subscribed for any districts yet.`

  if (user.districts && user.districts.length > 0) {
    user.districts = user.districts.filter(
      ({ id }) => !districtIds?.includes(id)
    )
    await user.save()

    message = `Hey ${from?.first_name}
      
We removed the districts you wanted.`
  }

  return bot.sendMessage(chat.id, message)
}
