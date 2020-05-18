const { publish, spawnModal, updateModal, sendMessages } = require('./lib/@adambraimbridge/abslackt')
const { plays, homepage } = require('./plays')

const updateHomepage = async ({ payload }) => {
	console.debug('🦄 updating homepage')
	const { user, view, tab } = payload.event || payload

	if (tab !== 'home') {
		console.warn(`🐶 Tab: ${tab}`)
		return false
	}

	const { title } = view
	const { blocks } = homepage
	await publish({
		user_id: user.id || user,
		view: {
			type: 'home',
			title,
			blocks,
		},
	})
}

const deliverModals = ({ payload, progress }) => {
	const { action, playId, title, transcript, text, nextLine } = progress
	const { trigger_id } = payload
	const view_id = payload.view.id

	const view = {
		callback_id: playId,
		type: 'modal',
		title: {
			type: 'plain_text',
			text: title,
			emoji: true,
		},
		blocks: [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text,
				},
			},
		],
	}

	const { type: nextLineType } = transcript[nextLine]

	const element = {
		type: 'button',
		text: {
			type: 'plain_text',
			text: nextLineType === 'message' ? `I'll check my messages` : 'Continue',
		},
		style: nextLineType === 'message' ? 'danger' : 'primary',
		value: `${nextLine}`,
		action_id: nextLineType === 'message' ? 'check-messages' : 'continue',
	}

	if (nextLineType === 'message') {
		const { team, api_app_id: appId } = payload
		const { id: teamId } = team
		element.url = `slack://app?team=${teamId}&id=${appId}&tab=messages`
	}

	view.blocks.push({
		type: 'actions',
		block_id: playId,
		elements: [element],
	})

	if (action === 'play') {
		console.debug(`🦄 Spawning a new modal. (Action: ${action})`)
		spawnModal({
			trigger_id,
			view,
		})
	} else {
		console.debug(`🦄 Updating an existing modal. (Action: ${action})`)
		updateModal({
			view_id,
			view,
		})
	}

	// updateHomepage({ payload })
}

const deliverMessages = async ({ payload, progress }) => {
	const { currentLine, transcript, cast } = progress
	cast.player = payload.user

	// Get the list of messages from currentLine to the next non-message line.
	const firstPass = transcript.slice(currentLine, transcript.length) //
	const messageCount = firstPass.findIndex((line) => line.type !== 'message')
	const messages = firstPass.slice(0, messageCount)

	const enrichedMessages = messages.map((message) => {
		// @todo: do any template string substitutions, e.g. {{player}}
		return message
	})

	sendMessages({ cast, messages: enrichedMessages })
}

const handleBlockActions = ({ payload }) => {
	console.debug('🦄 Event: block_actions.')

	const { action_id: action, block_id: playId, value } = payload.actions[0]
	const currentLine = parseInt(value)

	const nowShowing = plays.find((play) => play.id === playId)
	if (!nowShowing) {
		console.warn(`🐶 Play not found for "${playId}".`)
		return false
	}
	const { title, transcript, cast } = nowShowing
	console.debug(`🦄 Now showing: ${title}`)

	// const currentLine = (applicationState[playId] && applicationState[playId].currentLine) || 0
	const { text, type } = transcript[currentLine]
	console.debug(`🦄 Line ${currentLine} (${type}): ${text}`)

	const nextLine = currentLine + 1
	if (!transcript[nextLine]) {
		console.warn('🐶 Next line not found.')
	}

	const progress = {
		action,
		playId,
		title,
		transcript,
		cast,
		text,
		currentLine,
		nextLine,
	}

	if (type === 'modal') {
		console.debug(`🦄 Calling deliverModals()`)
		deliverModals({ payload, progress })
	} else {
		console.debug(`🦄 Calling deliverMessages()`)
		deliverMessages({ payload, progress })
	}
}

const handleViewSubmissions = ({ payload }) => {
	console.debug('🦄 Event: view_submission.')
	console.debug({ ...payload.view })
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
	if (type === 'app_home_opened') updateHomepage({ payload })
	if (type === 'block_actions') handleBlockActions({ payload })
	if (type === 'view_submission') handleViewSubmissions({ payload })

	return {
		statusCode: 200,
		body: '',
	}
}
