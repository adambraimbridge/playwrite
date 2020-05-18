const { plays, homepage } = require('../../plays')

// Load application state from the `private_metadata` property.
const loadApplicationState = ({ slack }) => {
	const { view } = slack.payload.event ? slack.payload.event : slack.payload
	if (!view) {
		console.warn('🐶 Could not load view.')
		return false
	}

	const { private_metadata } = view
	if (!private_metadata) {
		console.warn('🐶 Could not load applicationState.')
		return false
	}

	let applicationState = {}
	try {
		applicationState = JSON.parse(private_metadata)
	} catch (error) {
		console.warn(error.message)
	}
	slack.applicationState = applicationState
}

const setUpSlackWebhooks = ({ slack }) => {
	// User clicked the app homepage.
	slack.on('app_home_opened', () => {
		updateHomepage({ slack })
	})

	// User clicked a button inside a block:
	// Either from the application homepage or an active modal.
	// This should trigger the first (or the most recent) modal.
	slack.on('block_actions', () => {
		console.debug('🦄 Event: block_actions.')
		const { applicationState, payload } = slack

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
		// console.debug(`🦄 Line ${currentLine} (${type}): ${text}`)

		const nextLine = currentLine + 1
		if (!transcript[nextLine]) {
			console.warn('🐶 Next line not found.')
		}

		slack.progress = {
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
			// console.debug(`🦄 Calling deliverModals()`)
			deliverModals({ slack })
		} else {
			// console.debug(`🦄 Calling deliverMessages()`)
			deliverMessages({ slack })
		}
	})

	// User clicked a "Okay" button at the bottom of a modal.
	// This should close the modal and queue the next messages.
	slack.on('view_submission', () => {
		// console.debug('🦄 Event: view_submission.')
		// console.debug({ ...slack.payload.view })
	})
}

const updateHomepage = async ({ slack }) => {
	// console.debug('🦄 updating homepage')
	// console.debug(`🦄 homepage application state:`)
	// console.debug({ ...slack.applicationState })

	const { user, view, tab } = slack.payload.event || slack.payload

	if (tab !== 'home') {
		console.warn(`🐶 Toto, I've a feeling we're not in Kansas anymore. Tab: ${tab}`)
		return false
	}

	const { title } = view
	const { blocks } = homepage

	await slack.publish({
		user_id: user.id || user,
		view: {
			type: 'home',
			title,
			blocks,
			private_metadata: JSON.stringify(slack.applicationState),
		},
	})
}

const deliverModals = ({ slack }) => {
	const { progress, payload } = slack
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
	// console.debug(`🦄 Next line is a ${nextLineType}.`)

	const element = {
		type: 'button',
		text: {
			type: 'plain_text',
			text: nextLineType === 'message' ? `Cool. I'll check my messages` : 'Continue',
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

	const block = {
		type: 'actions',
		block_id: playId,
		elements: [element],
	}

	view.blocks.push(block)

	// Object.assign(applicationState, {
	// 	[playId]: {
	// 		currentLine: nextLine,
	// 	},
	// })
	// view.private_metadata = JSON.stringify(applicationState)

	if (action === 'play') {
		// console.debug(`🦄 Spawning a new modal. (Action: ${action})`)
		slack.spawnModal({
			trigger_id,
			view,
		})
	} else {
		// console.debug(`🦄 Updating an existing modal. (Action: ${action})`)
		slack.updateModal({
			view_id,
			view,
		})
	}

	// updateHomepage({ slack })
}

const deliverMessages = async ({ slack }) => {
	const { currentLine, transcript, cast } = slack.progress
	cast.player = slack.payload.user

	// Get the list of messages from currentLine to the next non-message line.
	const firstPass = transcript.slice(currentLine, transcript.length) //
	const messageCount = firstPass.findIndex((line) => line.type !== 'message')
	const messages = firstPass.slice(0, messageCount)

	const enrichedMessages = messages.map((message) => {
		// @todo: do any template string substitutions, e.g. {{player}}
		return message
	})

	slack.sendMessages({ cast, messages: enrichedMessages })
}

const raiseCurtains = (slack) => {
	// loadApplicationState({ slack })
	setUpSlackWebhooks({ slack })
	slack.run()
}

const director = {
	raiseCurtains,
}

module.exports = director
