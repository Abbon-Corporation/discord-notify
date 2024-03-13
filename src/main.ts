import { getInput, setFailed, setOutput } from '@actions/core'
import { sendDiscordWebhook } from './helpers'

export async function run(): Promise<void> {
  try {
    const title: string = getInput('title') || ''
    const description: string = getInput('description')
    const messageId: string = getInput('message_id')

    const payload = {
      embeds: [
        {
          type: 'rich',
          title,
          ...(description ? { description } : {}),
          color: 16777215,
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Abbon Corporation',
            icon_url:
              'https://avatars.githubusercontent.com/u/127878265?s=200&v=4',
          },
        },
      ],
    }

    if (!messageId) {
      const response = await sendDiscordWebhook(payload)
      setOutput('message_id', response.id)
    } else {
      const response = await sendDiscordWebhook(payload, messageId)
      setOutput('message_id', response.id)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) setFailed(error.message)
  }
}
