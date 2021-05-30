import TelegramBot, { Message } from "node-telegram-bot-api"
import districts from "@data/districts.json"

const flattenedDistricts: { districtId: number; districtName: string }[] = []

Object.values(districts).forEach((dists) => flattenedDistricts.push(...dists))

export const handleDistrictsCommand = (
  bot: TelegramBot,
  { chat, from, text }: Message
) => {
  const districtIds = text?.split("\n").map((txt) => parseInt(txt.substring(1)))

  const validDistricts: { districtId: number; districtName: string }[] = []

  districtIds?.forEach((id) => {
    const dist = flattenedDistricts.find((dist) => dist.districtId === id)

    if (dist) {
      validDistricts.push(dist)
    }
  })

  if (validDistricts.length > 0) {
    const message = `Awesome ${from?.first_name}

You have signed up for these districts - 
${validDistricts.map(({ districtName }) => districtName).join(", ")}

We will be regularly notifying you for slot availabilities in these districts.`

    return bot.sendMessage(chat.id, message)
  }

  const message =
    "Looks like you did not reply correctly, make sure you choose correct districts' ids"

  return bot.sendMessage(chat.id, message)
}
