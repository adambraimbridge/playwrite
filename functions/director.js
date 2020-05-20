const { publish, spawnModal, updateModal, sendMessages, getConversation, getUser } = require('./lib/@adambraimbridge/abslackt')
const { plays, homepage } = require('./plays')

const updateHomepage = async ({ event }) => {
	const { user, view, tab } = event

	if (tab !== 'home') {
		console.warn(`🐶 Tab: ${tab}`)
		return false
	}

	const { title } = view
	const { blocks } = homepage
	publish({
		user_id: user.id || user,
		view: {
			type: 'home',
			title,
			blocks,
		},
	})
}

const deliverModal = ({ modalId, playId, playTitle, action, currentLine, nextLine, nextLineNumber, homepageUrl }) => {
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

	// View
	const view = {
		callback_id: playId,
		type: 'modal',
		title: {
			type: 'plain_text',
			text: playTitle,
			emoji: true,
		},
		blocks,
	}
	if (action === 'play') {
		spawnModal({
			trigger_id: modalId,
			view,
		}).catch(console.error)
	} else {
		updateModal({
			view_id: modalId,
			view,
		}).catch(console.error)
	}

	// @todo update the homepage to store game progress (..?)
	// updateHomepage({ payload })
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

	const nowShowing = plays.find((play) => play.id === playId)
	if (!nowShowing) {
		console.warn(`🐶 Play not found for "${playId}".`)
		return false
	}
	const { cast, getTranscript } = nowShowing

	const player = await getUser({ user: payload.user.id })
	const transcript = getTranscript({ player })

	// @todo move this to a "getCast({player})" function
	player.icon_emoji = ':cat:'
	cast.player = player

	// @todo update the homepage to store the conversation's channel ID (..?)
	// updateHomepage({ payload })
	const { conversation } = await getConversation({
		playId,
		playerId: player.id,
	})

	let currentLineNumber

	// If the action was an option in a message,
	// 1. find the option in the transcript that matches the`action_id`
	// 2. update the button that was clicked to show it was right (green) or wrong (red)
	// 3. Then send the appropriate response message to the channel. (@todo handle responses that are modals)
	if (action.includes('option-')) {
		const { lineNumber, optionNumber } = JSON.parse(value)
		const selectedOption = transcript[lineNumber].options[optionNumber]
		const messages = [selectedOption.response]
		sendMessages({
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
	} else {
		currentLineNumber = parseInt(value)
	}

	const currentLine = transcript[currentLineNumber]
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
			modalId: action === 'play' ? payload.trigger_id : payload.view.id,
			playId,
			playTitle: nowShowing.title,
			action,
			currentLine,
			nextLine,
			nextLineNumber,
			homepageUrl,
		})
	}
}

const handleViewSubmissions = ({ payload }) => {}

exports.handler = async (request) => {
	if (!request.headers['x-playwrite-api-key'] || request.headers['x-playwrite-api-key'] !== process.env.PLAYWRITE_API_KEY) {
		console.warn('🤔 Incorrect or missing x-playwrite-api-key')
		return {
			statusCode: 500,
		}
	}

	const payload = JSON.parse(request.body)
	const { type } = payload.event || payload // @note `app_home_opened` type is in payload.event, and the others are in payload.
	console.debug(`🦄 Type: ${type}`)
	if (type === 'app_home_opened') updateHomepage({ event: payload.event })
	if (type === 'block_actions') handleBlockActions({ payload })
	if (type === 'view_submission') handleViewSubmissions({ payload })

	return {
		statusCode: 200,
		body: '',
	}
}
