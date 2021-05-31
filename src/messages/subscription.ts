import TelegramBot, { Message } from "node-telegram-bot-api"
import { User } from "@entities"

export const handleSubscriptionCommand = async (
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
    message = `Hey ${from?.first_name}
      
You have signed up for these districts - 
${user.districts?.map(({ name }) => name).join(", ")}
   
We will be regularly notifying you for slot availabilities in these districts.`
  }

  return bot.sendMessage(chat.id, message)
}
