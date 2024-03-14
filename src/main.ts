import { getInput, setFailed, setOutput } from '@actions/core'
import { sendDiscordWebhook } from './helpers'

export async function run(): Promise<void> {
  try {
    const title: string = getInput('title') || ''
    const description: string = getInput('description')
    const messageId: string = getInput('message_id')
    const url: string = getInput('url')
    const color: string = getInput('color') || '#ffffff'

    if (!title) {
      throw new Error('Title is required')
    }

    const colorNumber = parseInt(color.replace('#', '').toLowerCase(), 16)

    const payload = {
      embeds: [
        {
          type: 'rich',
          title,
          ...(description ? { description } : {}),
          color: colorNumber,
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Abbon Corporation',
            icon_url:
              'https://avatars.githubusercontent.com/u/127878265?s=200&v=4',
          },
          ...(url ? { url } : {}),
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
