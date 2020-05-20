const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN)

// @see https://api.slack.com/docs/conversations-api
const getConversation = async ({ playId, playerId }) => {
	let conversation
	const name = `${playId}-${playerId}`.toLowerCase()

	console.debug(`🦄 Searching for ${name} ... `)
	const userConversations = await slackWebClient.users //
		.conversations({
			limit: 1000,
			types: 'private_channel',
			user: playerId,
		})
		.catch(console.error)

	conversation = userConversations.channels.find((channel) => {
		return channel.name === name
	})

	// If not found, create
	if (!conversation) {
		const result = await slackWebClient.conversations //
			.create({
				name,
				is_private: true,
			})
			// @bug: Sometimes, `conversations.create()` incorrectly errors with "name_taken"
			.catch(async (error) => {
				console.warn(error.message)
				return await slackWebClient.conversations //
					.create({
						name: `${name}-${Date.now()}`,
						is_private: true,
					})
			})
		conversation = result.channel
	}

	// @todo Check that the conversation hasn't been deleted/archived/abandoned by the user ..?
	await slackWebClient.conversations //
		.invite({
			channel: conversation.id,
			users: `${playerId}`,
		})
		.catch(console.error)

	return {
		conversation,
	}
}

module.exports = {
	getConversation,
}
