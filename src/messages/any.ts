import TelegramBot, { Message } from "node-telegram-bot-api"

export const handleAnyCommand = async (
  bot: TelegramBot,
  { from, chat }: Message
) => {
  const commands = await bot.getMyCommands()

  const message = `Hey ${from?.first_name}

This bot notifies you whenever there are slots for coronavirus vaccines available in the districts(s) you subscribe for.

You can control this bot with these commands -

${commands
  .map(({ command, description }) => `/${command} - ${description}`)
  .join("\n")}
  `

  return bot.sendMessage(chat.id, message)
}
