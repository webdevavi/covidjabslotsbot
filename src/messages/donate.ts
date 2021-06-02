import TelegramBot, { Message } from "node-telegram-bot-api"

export const handleDonateCommand = (
  bot: TelegramBot,
  { chat, from }: Message
) =>
  bot.sendMessage(
    chat.id,
    `Hi ${from?.first_name ?? ""} \u{1F607}

I created this bot only to help you all out, and not for any personal profit or so. \u{2705}

The time and hard work I put to make this bot better every day, that can't be paid off in any way. But in order to keep this bot up and running I need your help as I have to pay for the server and database. \u{1F4BB}

If this bot could help you, you can donate any amount you wish at https://buymeacoff.ee/webdevavi. \u{1F680}

Or you can just say Hi \u{1F44B} at @webdevavi and share your feedback with me.

Thanks! \u{1F600}`
  )
