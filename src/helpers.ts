import { getInput } from '@actions/core'
import { HttpClient } from '@actions/http-client'

const client = new HttpClient('action')

export const sendDiscordWebhook = async (payload: any, messageId?: string) => {
  const webhookId = getInput('webhook_id')
  const webhookToken = getInput('webhook_token')

  let baseURL = `https://discord.com/api/webhooks/${webhookId}/${webhookToken}`
  if (messageId) {
    baseURL += `/messages/${messageId}`
  }

  const params = new URLSearchParams({ wait: 'true' })
  const url = `${baseURL}?${params.toString()}`

  const verb = messageId ? 'PATCH' : 'POST'

  const response = await client.request(verb, url, JSON.stringify(payload), {
    'Content-Type': 'application/json',
  })

  if (response.message.statusCode !== 200) {
    throw new Error(
      `Failed to send Discord webhook: ${await response.readBody()}`,
    )
  }

  const body = await response.readBody()

  return JSON.parse(body)
}
