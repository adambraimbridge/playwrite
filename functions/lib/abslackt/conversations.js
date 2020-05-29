// @see https://api.slack.com/docs/conversations-api
const getConversation = async ({ slackWebClient, name, playerId }) => {
	let conversation
	console.debug(`🦄 Searching for conversation #${name} ... `)
	const userConversations = await slackWebClient.users //
		.conversations({
			limit: 1000,
			types: 'private_channel',
			exclude_archived: true,
			user: playerId,
		})
		.catch(console.error)

	conversation =
		userConversations &&
		userConversations.channels.find((channel) => {
			return RegExp(`^${name}`).test(channel.name)
		})

	if (!conversation) {
		console.debug('🦄 Slack conversation channel not found. This is fine.')
		return false
	}

	await inviteUser({
		slackWebClient,
		channel: conversation.id,
		users: `${playerId}`,
	})
	return {
		conversation,
	}
}

const createConversation = async ({ slackWebClient, name, playerId }) => {
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
	await inviteUser({
		slackWebClient,
		channel: conversation.id,
		users: `${playerId}`,
	})
	return {
		conversation,
	}
}

// @todo Check that the conversation hasn't been deleted/archived/abandoned ..?
const inviteUser = async ({ slackWebClient, channel, users }) => {
	console.log(`🦄 Inviting user #${users} to the conversation`)
	await slackWebClient.conversations //
		.invite({
			channel,
			users,
		})
		.catch(console.error)
}

// It's not possible to delete conversations via Slack API
// And it's not possible to delete 100% of messages from a conversation.
// So yeeting === rename then archive channel.
const yeetConversation = async ({ slackWebClient, name, id }) => {
	console.debug(`🦄 Yeeting conversation ${id} ... `)
	await slackWebClient.conversations //
		.rename({
			channel: id,
			name: `${name}-${Date.now()}`,
		})
		.catch(console.error)

	await slackWebClient.conversations //
		.archive({
			channel: id,
		})
		.catch(console.error)
}

module.exports = {
	getConversation,
	createConversation,
	yeetConversation,
}
