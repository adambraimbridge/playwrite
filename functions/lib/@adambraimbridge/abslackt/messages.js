const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN)

// @see https://api.slack.com/methods/conversations.open
// @see https://api.slack.com/methods/chat.scheduleMessage
const sendMessages = async ({ cast, messages }) => {
	console.debug(`🦄 Sending messages.`)

	const { player } = cast
	const { channel } = await slackWebClient.conversations //
		.create({
			name: 'Monday',
			is_private: true,
			users: player.id,
		})
		.catch(console.error)

	// Post the first message now, and
	// schedule the next messages five seconds in future
	const firstMessage = messages.shift()
	await slackWebClient.chat
		.postMessage({
			channel: channel.id,
			text: firstMessage.text,
		})
		.catch(console.error)

	const now = Math.floor(Date.now() / 1000)
	let seconds = now + 5
	for (let message of messages) {
		const { text } = message
		seconds = seconds + Math.floor(text.length / 10)
		await slackWebClient.chat
			.scheduleMessage({
				channel: channel.id,
				post_at: seconds,
				text,
			})
			.catch(console.error)
	}
}

module.exports = {
	sendMessages,
}
