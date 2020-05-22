const {
	publish, //
	spawnModal,
	updateModal,
	sendMessages,
	getConversation,
	createConversation,
	yeetConversation,
	getUser,
} = require('./lib/@adambraimbridge/abslackt')

const { getPlay, getPlayBlocks } = require('./plays')

const updateHomepage = async ({ user_id }) => {
	console.debug(`🦄 Updating homepage for user #${user_id}`)
	const blocks = await getPlayBlocks({ user_id })
	const taglines = [
		`Because you're worth it.`, //
		`Because FT stands for Fun Training.`,
		`Learning doesn't have to be boring.`,
		`Lockdown? More like _learn_ down amirite`,
		`Hey. You're awesome. I don't say that often enough. But you are.`,
		`Stay tuned for further updates.`,
		`Breaking down the barriers and holding a mirror up to global multiculturalism`,
		`:birthday: Happy birthday!`,
		`The best experience for corporate games synergy engagement.`,
		`I can't believe I get paid to do this.`,
		`Join #iloveadam today!`,
		`Without fear and without favour.`,
	]
	const randomTagline = taglines[Math.floor(Math.random() * taglines.length)]
	blocks.push({
		type: 'context',
		elements: [
			{
				type: 'mrkdwn',
				text: `:performing_arts: _Playwrite._ ${randomTagline}`,
			},
		],
	})

	publish({
		user_id,
		view: {
			type: 'home',
			blocks,
		},
	})
}

const deliverModal = ({ view_id, view, playId, currentLine, nextLine, nextLineNumber, homepageUrl }) => {
	const blocks = []

	// Image block
	const { image_url, alt_text } = currentLine
	if (image_url) {
		blocks.push({
			type: 'image',
			image_url,
			alt_text,
		})
	}

	// Text block
	const { text } = currentLine
	if (text) {
		blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text,
			},
		})
	}

	// Actions block
	const { type: nextLineType } = nextLine
	let buttonText = 'Continue'
	let buttonStyle = 'primary'
	let buttonAction = 'continue'
	let buttonUrl

	if (nextLineType === 'message') {
		// @hack Slack API doesn't let you close modal views on 'block_actions' events.
		// But if you redirect from a modal to an App homepage, it closes any open modal views.
		// @todo change this url to the appropriate channel, if possible
		buttonUrl = homepageUrl

		// @todo Update the homepage so that the "Play" button's label changes to "Check messages" and redirects to the appropriate channel
		buttonText = `I'll check my messages`
		buttonStyle = 'danger'
		buttonAction = 'check-messages'
	}
	blocks.push({
		type: 'actions',
		block_id: playId,
		elements: [
			{
				type: 'button',
				text: {
					type: 'plain_text',
					text: buttonText,
				},
				style: buttonStyle,
				value: `${nextLineNumber}`,
				action_id: buttonAction,
				url: buttonUrl,
			},
		],
	})

	view.blocks = blocks
	updateModal({
		view_id,
		view,
	}).catch(console.error)
}

const deliverMessages = async ({ playId, cast, transcript, currentLineNumber, conversation }) => {
	// Get the list of messages from currentLineNumber to the next interaction cue.
	const unplayedMessages = transcript.slice(currentLineNumber, transcript.length)
	const nextInteractionCue = unplayedMessages.findIndex((line) => line.interactionCue === true) + 1 // include the interaction-cue message.
	const messageCount = nextInteractionCue ? nextInteractionCue : unplayedMessages.length
	const messages = unplayedMessages.slice(0, messageCount)
	sendMessages({
		playId,
		cast,
		messages,
		conversation,
		currentLineNumber,
	})
}

const handleBlockActions = async ({ payload }) => {
	const { action_id: action, block_id: playId, value } = payload.actions[0]
	console.debug(`🦄 Action = ${action}`)
	if (
		!action.includes('option-') &&
		![
			'play', //
			'continue',
			'restart',
			'messages-link',
			'check-messages',
		].includes(action)
	) {
		console.warn('🐶 Unrecognised action.')
		return false
	}

	if (action === 'messages-link') {
		// @todo check that the player has made it past the modal onboarding.
		// or move the channel creation to after the onboarding ends.
		console.debug('🦄 Player clicked a link to the appropriate Slack conversation channel.')
		return false
	}

	const nowShowing = await getPlay({ playId })
	if (!nowShowing) {
		console.warn(`🐶 Play not found for "${playId}".`)
		return false
	}
	const { title, cast, getTranscript } = nowShowing

	// `trigger_id` must be used within 500ms. in this case, it is needed to spawn a modal view.
	// The subsequent view id can thereafter be used for modal updates (within a few hours)
	let view = payload.view
	if (action === 'play') {
		const response = await spawnModal({
			trigger_id: payload.trigger_id,
			view: {
				callback_id: playId,
				type: 'modal',
				title: {
					type: 'plain_text',
					text: title,
					emoji: true,
				},
				// @todo add a loading screen block
				blocks: [],
			},
		}).catch(console.error)
		view = response.view
	}

	const player = await getUser({ user: payload.user.id })
	const conversationName = `${playId}-${player.id}`.toLowerCase()
	const { id: playerId } = await getUser({ user: payload.user.id })
	const details = {
		name: conversationName,
		playerId,
	}

	let conversation
	const existing = await getConversation(details)
	if (!!existing) {
		conversation = existing.conversation
	} else {
		const created = await createConversation(details)
		conversation = created.conversation
	}

	const transcript = getTranscript({ player })
	let currentLineNumber
	// If the action was an option in a message,
	//  1. find the option in the transcript that matches the`action_id`
	//  2. update the button that was clicked to show it was right (green) or wrong (red)
	//  3. Then send the appropriate response message to the channel.
	//     @todo handle responses that are modals
	if (action.includes('option-')) {
		const { lineNumber, optionNumber } = JSON.parse(value)
		const selectedOption = transcript[lineNumber].options[optionNumber]
		const messages = [selectedOption.response]

		// @note skip the "fake typing" delay for option interations.
		sendMessages({
			skipDelay: true,
			playId,
			cast,
			messages,
			conversation,
			currentLineNumber: lineNumber,
		})

		if (!selectedOption.correct) {
			return
		} else {
			currentLineNumber = lineNumber + 1
		}
	} else if (action === 'restart') {
		console.debug('🦄 Restart by yeeting the appropriate channel.')
		await yeetConversation({
			name: conversationName,
			id: value,
		})
		// @todo decide whether or not to trigger the modal when "Restart" is clicked
		// currentLineNumber = 0
		return
	} else {
		currentLineNumber = parseInt(value)
	}
	const currentLine = transcript[currentLineNumber]
	if (!currentLine) {
		throw new Error(`🤔 Could not find line #${currentLineNumber} in ${playId}`)
	}

	const { type } = currentLine
	if (type === 'message') {
		deliverMessages({
			playId,
			cast,
			transcript,
			currentLineNumber,
			conversation,
		})
	}

	if (type === 'modal') {
		const homepageUrl = `slack://app?team=${payload.team.id}&id=${payload.api_app_id}&tab=home`
		const nextLineNumber = currentLineNumber + 1
		const nextLine = transcript[nextLineNumber]

		// @todo handle the end of the play if appropriate
		if (!nextLine) console.warn('🐶 Next line not found.')

		deliverModal({
			view_id: view.id,
			view: {
				type: 'modal',
				title: view.title,
				callback_id: view.callback_id,
			},
			playId,
			currentLine,
			nextLine,
			nextLineNumber,
			homepageUrl,
		})
	}
}

const handleViewSubmissions = ({ payload }) => {
	// @todo ^ this.
}

exports.handler = async (request) => {
	if (!request.headers['x-playwrite-api-key'] || request.headers['x-playwrite-api-key'] !== process.env.PLAYWRITE_API_KEY) {
		console.warn('🤔 Incorrect or missing x-playwrite-api-key')
		return {
			statusCode: 500,
		}
	}

	const payload = JSON.parse(request.body)
	const { type } = payload
	console.debug(`🦄 Event type: ${type}`)

	if (type === 'block_actions') {
		await handleBlockActions({ payload }).catch(console.error)
	}

	// if (type === 'view_submission') {
	// 	await handleViewSubmissions({ payload }).catch(console.error)
	// }

	const user_id = payload.event ? payload.event.user : payload.user.id
	updateHomepage({ user_id }).catch(console.error)

	return {
		statusCode: 200,
		body: '',
	}
}
