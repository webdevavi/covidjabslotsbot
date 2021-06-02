import {
  handleStartCommand,
  handleAnyCommand,
  handleStatesCommand,
  handleDistrictsCommand,
  handleEndCommand,
  handleSubscriptionCommand,
  handleRemoveCommand,
  handleRemoveDistrictsCommand,
  handleDonateCommand,
} from "@messages"
import TelegramBot, { Message } from "node-telegram-bot-api"

export const handleMessages = (bot: TelegramBot, message: Message) => {
  const text = message.text ?? ""

  switch (true) {
    case /^\/start$/gi.test(text): {
      return handleStartCommand(bot, message)
    }

    case /^S[0-9]*$/gi.test(text): {
      return handleStatesCommand(bot, message)
    }

    case /^D[0-9]*$/gim.test(text): {
      return handleDistrictsCommand(bot, message)
    }

    case /^\/end$/gi.test(text): {
      return handleEndCommand(bot, message)
    }

    case /^\/subscription$/gi.test(text): {
      return handleSubscriptionCommand(bot, message)
    }

    case /^\/remove$/gi.test(text): {
      return handleRemoveCommand(bot, message)
    }

    case /^-D[0-9]*$/gim.test(text): {
      return handleRemoveDistrictsCommand(bot, message)
    }

    case /^\/donate$/gim.test(text): {
      return handleDonateCommand(bot, message)
    }

    default: {
      return handleAnyCommand(bot, message)
    }
  }
}
