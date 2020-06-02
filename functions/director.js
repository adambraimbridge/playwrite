const axios = require('axios')
const { NETLIFY_DEV, PLAYWRITE_API_KEY, NETLIFY_AUTH_TOKEN, NETLIFY_PLAYWRITE_SITE_ID } = process.env
const SITE_HOST = NETLIFY_DEV === 'true' ? 'https://playwrite.ngrok.io' : 'https://playwrite.netlify.app'
const NetlifyAPI = require('netlify')

const { getAbslackt } = require('./lib/abslackt')
const { getRandomTagline } = require('./lib/branding')
const { getPlay, getPlayBlocks } = require('./lib/plays')

const getConversation = async ({ abslackt, name, playerId }) => {
	const existing = await abslackt.getConversation({ name, playerId })
	if (!!existing) {
		conversation = existing.conversation
	} else {
		const created = await abslackt.createConversation({ name, playerId })
		conversation = created.conversation
	}
	return { conversation }
}

const updateHomepage = async ({ abslackt, user_id }) => {
	console.debug(`🦄 Updating homepage for user #${user_id}`)
	const blocks = await getPlayBlocks({ abslackt, user_id })
	const randomTagline = getRandomTagline()
	blocks.push({
		type: 'context',
		elements: [
			{
				type: 'mrkdwn',
				text: `:performing_arts: _Playwrite._ ${randomTagline}`,
			},
		],
	})

	await abslackt.publish({
		user_id,
		view: {
			type: 'home',
			blocks,
		},
	})
}

const getModal = async ({ abslackt, trigger_id }) => {
	const { view } = await abslackt
		.spawnModal({
			trigger_id,
			view: {
				callback_id: 'playwrite',
				type: 'modal',
				title: {
					type: 'plain_text',
					text: 'Playwrite',
					emoji: true,
				},
				blocks: [
					{
						type: 'image',
						image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Loading-red-spot.gif',
						alt_text: 'Loading ... [Attribution: Baharboloor25 / CC BY-SA (https://creativecommons.org/licenses/by-sa/4.0)]',
					},
				],
			},
		})
		.catch(console.error)
	return view
}

const deliverModal = async ({ abslackt, view_id, view, playId, currentLine, nextLine, nextLineNumber, homepageUrl }) => {
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

	const value = JSON.stringify({
		currentLineNumber: nextLineNumber,
	})
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
				value,
				action_id: buttonAction,
				url: buttonUrl,
			},
		],
	})

	view.blocks = blocks
	await abslackt
		.updateModal({
			view_id,
			view,
		})
		.catch(console.error)
}

const postMessage = async ({ currentLineNumber, currentLine, action, actionValue, access_token, playId, cast, conversation }) => {
	console.debug(`🦄 Type: Message. Current line number: ${currentLineNumber}`)
	let message = currentLine
	let playNextMessage = true

	// If the action was an option in a message,
	//  1. Find the option in the transcript that matches the`action_id`
	//  2. Then send the appropriate response message to the conversation channel.
	//     @todo handle responses that are modals
	if (!!action && action.includes('option-')) {
		const { optionNumber } = actionValue
		const selectedOption = currentLine.options[optionNumber]
		message = selectedOption.response
		playNextMessage = !!selectedOption.playNextMessage // This will "pause" the play unless `playNextMessage` is explicitly set to `true`
	}

	console.debug(`🦄 Sending message`)
	const messageData = {
		access_token,
		playId,
		cast,
		message,
		conversation,
		currentLineNumber,
		playNextMessage,
	}
	axios.post(`${SITE_HOST}/.netlify/functions/post-message`, messageData, {
		headers: {
			'x-playwrite-api-key': PLAYWRITE_API_KEY,
		},
	})
}

const cueNextMessage = async ({ payload }) => {
	console.debug(`🦄 Cueing next message`)
	const {
		access_token, //
		currentLineNumber,
		conversation,
		cast,
		playId,
	} = payload

	// @todo refactor this dupe
	const nowShowing = await getPlay({ playId })
	if (!nowShowing) {
		console.warn(`🐶 Play not found for "${thePlayId}".`)
		return false
	}

	const { getTranscript } = nowShowing
	const transcript = getTranscript({ player: cast.player })
	const nextLineNumber = currentLineNumber + 1
	const currentLine = transcript[nextLineNumber]

	// @note Don't await here or it times out.
	postMessage({
		access_token,
		currentLineNumber: nextLineNumber,
		conversation,
		cast,
		playId,
		currentLine,
	})
}

const handleBlockActions = async ({ access_token, abslackt, payload }) => {
	const { action_id: action, block_id: playId, value } = payload.actions[0]
	console.debug(`🦄 Action = ${action}`)

	// @todo refactor this dupe
	const nowShowing = await getPlay({ playId })
	if (!nowShowing) {
		console.warn(`🐶 Play not found for "${playId}".`)
		return false
	}

	const user = await abslackt.getUser({ user: payload.user.id })
	const { id: playerId } = user
	const conversationName = `${playId}-${playerId}`.toLowerCase()

	if (action === 'restart') {
		console.debug('🦄 Restart by yeeting the appropriate channel.')
		return abslackt.yeetConversation({
			name: conversationName,
			id: value,
		})
	}

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

	// `trigger_id` must be used within 500ms. in this case, it is needed to spawn a modal view.
	// The subsequent view id can thereafter be used for modal updates (within a few hours)
	const view =
		action === 'play'
			? await getModal({
					abslackt,
					trigger_id: payload.trigger_id,
			  })
			: payload.view

	const { title, cast, getTranscript } = nowShowing

	// Let the player join the cast
	// @todo figure out how to display the player's avatar
	// @see https://api.slack.com/methods/chat.postMessage#arg_icon_url
	const { name: playerName } = user
	const player = {
		real_name: playerName,
		icon_emoji: ':speaking_head_in_silhouette:',
	}
	if (cast) {
		cast.player = player
	}

	// We use the Slack block's "action" value to store the current line number.
	const actionValue = JSON.parse(value)
	const currentLineNumber = actionValue.currentLineNumber || 0
	const transcript = getTranscript({ player })
	const currentLine = transcript[currentLineNumber]
	if (!currentLine) {
		throw new Error(`🤔 Could not find line #${currentLineNumber} in ${playId}`)
	}
	const { type } = currentLine
	if (type === 'message') {
		const { conversation } = await getConversation({
			abslackt,
			name: conversationName,
			playerId,
		})

		// @note Don't await here or it times out.
		postMessage({
			currentLineNumber,
			currentLine,
			action,
			actionValue,
			access_token,
			playId,
			cast,
			conversation,
		})
	}

	// For modals, we need to know the next line because reasons
	// @todo I forgot the reasons
	if (type === 'modal') {
		const homepageUrl = `slack://app?team=${payload.team.id}&id=${payload.api_app_id}&tab=home`
		const nextLineNumber = currentLineNumber + 1
		const nextLine = transcript[nextLineNumber]
		console.debug(`🦄 Type: Modal. Next line number: ${nextLineNumber}`)

		// @todo handle the end of the play if appropriate.
		if (!nextLine) {
			console.warn('🐶 Next line not found.')
		}

		await deliverModal({
			abslackt,
			view_id: view.id,
			view: {
				type: 'modal',
				title: {
					type: 'plain_text',
					text: title,
					emoji: true,
				},
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

const handleViewSubmissions = ({ abslackt, payload }) => {
	// @todo ^ this.
}

exports.handler = async (request) => {
	if (!request.headers['x-playwrite-api-key'] || request.headers['x-playwrite-api-key'] !== PLAYWRITE_API_KEY) {
		console.warn('🤔 Incorrect or missing x-playwrite-api-key')
		return {
			statusCode: 500,
			body: '🤔 Incorrect or missing key',
		}
	}

	const payload = JSON.parse(request.body)
	const { type, team, team_id } = payload

	console.debug(`🦄 Event type: ${type}`)

	// If the event type is 'cue_next_message', expect all the required details to be in the body payload.
	// This is meant to speed up the app logic, for better performance.
	if (type === 'cue_next_message') {
		cueNextMessage({ payload }).catch(console.error)
		return {
			statusCode: 200,
			body: '',
		}
	}

	const teamId = team_id ? team_id : team.id
	if (!teamId) {
		console.warn(`🤔 Error: team not found.`)
		return {
			statusCode: 200,
			body: '',
		}
	}

	const netlifyClient = new NetlifyAPI(NETLIFY_AUTH_TOKEN)
	const siteMetaData = await netlifyClient //
		.getSiteMetadata({
			site_id: NETLIFY_PLAYWRITE_SITE_ID,
		})
		.catch(console.error)

	const { access_token } = siteMetaData[teamId]
	if (!access_token) {
		console.warn(`🤔 Error: access_token not found.`)
		return {
			statusCode: 200,
			body: '',
		}
	}
	const abslackt = getAbslackt({ access_token })

	if (type === 'block_actions') {
		await handleBlockActions({ access_token, abslackt, payload }).catch(console.error)
	}

	if (type === 'view_submission') {
		await handleViewSubmissions({ abslackt, payload }).catch(console.error)
	}

	const user_id = payload.event ? payload.event.user : payload.user.id
	await updateHomepage({ abslackt, user_id }).catch(console.error)

	return {
		statusCode: 200,
		body: '',
	}
}
