const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN)

const delay = (milliseconds) => {
	return new Promise((resolve) => setTimeout(() => resolve(), milliseconds))
}

// @see https://api.slack.com/methods/chat.scheduleMessage
const sendMessages = async ({ playId, cast, messages, currentLineNumber, conversation }) => {
	console.debug(`🦄 Sending messages. Lines #${currentLineNumber} to #${currentLineNumber + messages.length}.`)
	const messageStub = {
		channel: conversation.id,
		link_names: true,
	}

	let lineNumber = currentLineNumber
	for (let message of messages) {
		const { real_name, icon_emoji } = cast[message.from]
		const { text, options } = message

		// Delay slightly between posting messages to simulate the real-life instant-messaging experience
		// @todo If there's a new actor "coming onstage" as it were, add another few seconds of delay, to further help with suspension of disbelief
		const milliseconds = text.length * 20
		await delay(milliseconds)

		const view = Object.assign({}, messageStub, {
			icon_emoji,
			username: real_name,
		})

		view.blocks = [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text,
				},
			},
		]

		if (options) {
			const elements = options.map((option, index) => {
				const { text } = option
				const value = JSON.stringify({
					lineNumber,
					optionNumber: index,
				})
				return {
					type: 'button',
					value,
					action_id: `option-${index}`,
					text: {
						type: 'plain_text',
						emoji: true,
						text,
					},
				}
			})

			view.blocks.push({
				type: 'actions',
				block_id: playId,
				elements,
			})
		}

		await slackWebClient.chat
			.postMessage(view) //
			.catch(console.error)

		lineNumber++
	}
}

module.exports = {
	sendMessages,
}
