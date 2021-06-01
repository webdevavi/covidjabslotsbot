import TelegramBot, { Message } from "node-telegram-bot-api"
import districts from "@data/districts.json"
import { District, User } from "@entities"
import { logger } from "@utils"

const flattenedDistricts: { districtId: number; districtName: string }[] = []

Object.values(districts).forEach((dists) => flattenedDistricts.push(...dists))

export const handleDistrictsCommand = async (
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
    const savedDistricts: District[] = await District.findByIds(
      validDistricts?.map(({ districtId }) => districtId)
    )

    const existingUser = await User.findOne(chat.id, {
      relations: ["districts"],
    })

    let message = ""

    if (existingUser) {
      existingUser.districts = existingUser.districts
        ? [...existingUser.districts, ...savedDistricts]
        : savedDistricts

      await existingUser.save()

      message = `Awesome ${from?.first_name}

You have added these districts to your existing subscription - 
${validDistricts.map(({ districtName }) => districtName).join(", ")}`
    } else {
      const user = new User()

      user.chatId = chat.id
      user.districts = savedDistricts

      await user.save()

      message = `Awesome ${from?.first_name}

You have signed up for these districts - 
${validDistricts.map(({ districtName }) => districtName).join(", ")}

We will be regularly notifying you for slot availabilities in these districts.`
    }

    return bot.sendMessage(chat.id, message)
  }

  const message =
    "Looks like you did not reply correctly, make sure you choose correct districts' ids"

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
