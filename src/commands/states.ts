import TelegramBot, { Message } from "node-telegram-bot-api"
import districts from "@data/districts.json"

export const handleStatesCommand = (
  bot: TelegramBot,
  { chat, text }: Message
) => {
  const stateId = parseInt(text?.substring(1) ?? "-1")

  if (
    typeof districts[stateId as unknown as keyof typeof districts] !==
    "undefined"
  ) {
    const exampleDistrict =
      districts[stateId as unknown as keyof typeof districts][
        Math.floor(
          Math.random() *
            districts[stateId as unknown as keyof typeof districts].length
        )
      ]

    const message = `${districts[stateId as unknown as keyof typeof districts]
      .map(({ districtId, districtName }) => `D${districtId} - ${districtName}`)
      .join("\n")}

Now select your district by replying the district's id

For example: For ${exampleDistrict.districtName}, reply D${
      exampleDistrict.districtId
    }
      
You can select more than one district by replying in multiple lines.
For example: 

D${exampleDistrict.districtId}
D${exampleDistrict.districtId + 1}
D${exampleDistrict.districtId + 2}`

    return bot.sendMessage(chat.id, message)
  }

  const message =
    "Looks like you did not reply correctly, make sure you choose correct states' ids"

  return bot.sendMessage(chat.id, message)
}
