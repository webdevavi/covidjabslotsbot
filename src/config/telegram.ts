import { TELEGRAM_API } from "@constants"
import TelegramBot from "node-telegram-bot-api"

export const initTelegramBot = () =>
  new TelegramBot(TELEGRAM_API, { polling: true })
