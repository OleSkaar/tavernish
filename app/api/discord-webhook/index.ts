// @ts-nocheck
import Discord from "discord.js"

const hook = new Discord.WebhookClient(process.env.DISCORD_ID, process.env.DISCORD_TOKEN)

export default function handler(req, res) {
  hook.send(req.body)
  return res.status(200).json({ text: req.body })
}
