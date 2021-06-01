import TelegramBot, { Message } from "node-telegram-bot-api"
import states from "@data/states.json"
import { User } from "@entities"
import { logger } from "@utils"

export const handleStartCommand = (
  bot: TelegramBot,
  { from, chat }: Message
) => {
  const exampleState = states[Math.floor(Math.random() * states.length)]

  return bot
    .sendMessage(
      chat.id,
      `Hey ${from?.first_name}, thanks for showing interest.

${states
  .map(({ stateId, stateName }) => `S${stateId} - ${stateName}`)
  .join("\n")}
    
Choose your state by replying the state's id
For example: For ${exampleState.stateName}, reply S${exampleState.stateId}`
    )
    .catch((error) => {
      if (
        error.response?.body?.description?.includes(
          "bot was blocked by the user"
        )
      ) {
        User.delete({ chatId: chat.id })
      }

      return logger.error(
        `Failed to send message to chat ${chat.id}; ${error.response?.body?.description}`
      )
    })
}
