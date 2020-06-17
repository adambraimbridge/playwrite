const { getPlay } = require('./plays')
const { getConversation } = require('./get-conversation')

const handleBlockActions = async ({ access_token, abslackt, payload }) => {
	// We use the Slack block's "action" value to store the current state.
	const actionState = payload.actions[0]
	const {
		action_id: action, //
		block_id: playId,
		value,
	} = actionState

	console.debug(`💥 Action = ${action}`)

	// @todo refactor this dupe
	const nowShowing = await getPlay({ playId })
	if (!nowShowing) {
		console.warn(`🐶 Play not found for "${playId}".`)
		return false
	}

	// @todo look for user (or conversationName) in actionState
	const user = await abslackt.getUser({ user: payload.user.id }).catch(console.error)
	const { id: playerId } = user
	const conversationName = `${playId}-${playerId}`.toLowerCase()

	if (action === 'restart') {
		console.debug('💥 Restart by yeeting the appropriate channel.')
		return abslackt.yeetConversation({
			name: conversationName,
			id: value,
		})
	}

	if (
		!action.includes('option-') && // Interaction: Play the appropriate response for the selected option
		![
			'play', // Begin the game from the app home page
			'restart', // Reset the game from the app home page
			'messages-link', // Redirect to the game conversation channel from the app home page
			'continue', // Continue to the next line in the modal window
			'check-messages', // Redirect to the app home page (effectively closing the modal window)
		].includes(action)
	) {
		console.warn('🐶 Unrecognised action.')
		return false
	}

	// Update the message to disable the selected action once it's "used up".
	if (action.includes('option-')) {
		console.debug(`💥 ${action} = ${actionState.text.text}`)
		disableSelectedOption({ abslackt, payload })
	}

	// @todo check that the player has made it past the modal onboarding (if appropriate). If not, then restart the game.
	if (action === 'messages-link') {
		console.debug('💥 Player clicked a link to the appropriate Slack conversation channel.')
		return false
	}

	const { cast } = nowShowing

	// Let the player join the cast
	// @todo figure out how to display the player's avatar
	// @see https://api.slack.com/methods/chat.postMessage#arg_icon_url
	const player = {
		...user,
		icon_emoji: ':speaking_head_in_silhouette:',
	}
	if (cast) {
		cast.player = player
	}

	const state = {
		currentLineNumber: 0,
	}
	try {
		const parsed = JSON.parse(actionState.value)
		if (parsed.currentLineNumber) {
			state.currentLineNumber = parsed.currentLineNumber
		}
	} catch (error) {}

	const { getTranscript } = nowShowing
	const transcript = getTranscript({ player })
	const currentLine = transcript[state.currentLineNumber]
	if (!currentLine) {
		throw new Error(`🤔 Could not find line #${state.currentLineNumber} in ${playId}`)
	}
	const { type } = currentLine

	// Store the conversation ID in the action value too
	if (type === 'message') {
		const messageData = {
			currentLine,
			action,
			state,
			access_token,
			playId,
			cast,
		}

		if (state.conversationId) {
			messageData.conversationId = state.conversationId
		} else {
			const { conversation } = await getConversation({
				abslackt,
				name: conversationName,
				playerId,
			})
			messageData.conversationId = conversation.id
		}

		await postMessage(messageData).catch(console.error)
	}
}

module.exports = {
	handleBlockActions,
}
