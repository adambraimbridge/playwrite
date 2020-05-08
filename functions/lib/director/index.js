const { plays } = require('../../plays')

const deliver = async ({ slack, modal, line }) => {
	const {
		id: view_id, //
		type,
		callback_id,
		title,
		blocks,
		state,
	} = modal

	state.currentLine = state.currentLine || 0
	state.currentLine++

	const { text } = line
	blocks.push({
		type: 'section',
		text: {
			type: 'mrkdwn',
			text,
		},
	})
	console.log({ blocks })

	const view = {
		title,
		blocks,
		type,
		callback_id,
	}

	const response = await slack.updateModal({ view_id, view })
}

const setupSlackWebhooks = (slack) => {
	// @todo: Capture errors for nicer UX
	slack.on('error', () => {
		console.log(`Slack error 01: ${error.message}`)
	})

	// User clicked the app home page
	slack.on('app_home_opened', async () => {
		const { user, tab } = slack.payload.event
		const { homepage } = plays
		homepage.type = tab
		const response = await slack.publish({ user_id: user, view: homepage })
		return response
	})

	// User clicked a button inside a block
	slack.on('block_actions', async () => {
		const callback_id = slack.payload.actions[0].value
		const nowShowing = plays.find((play) => play.id === callback_id)
		const { title, transcript } = nowShowing
		console.debug(`Now showing: ${title}`)

		const { trigger_id, state } = slack.payload
		const { view: modal } = await slack.spawnModal({ trigger_id, callback_id, title })

		for (let line of transcript) {
			const { type } = line
			if (type === 'message') {
				const response = await deliver({ slack, modal, line })
			} else {
				// break
			}
		}

		// view.callback_id = callback_id
		// const response = await slack.updateModal({ view_id, view })

		// return response
	})

	// // User clicked a button at the bottom of a modal
	// slack.on('view_submission', async () => {
	// 	const { id: view_id, callback_id } = slack.payload.view

	// 	view.callback_id = callback_id
	// 	const response = await slack.updateModal({ view_id, view })

	// 	return response
	// })
}

const raiseCurtains = (slack) => {
	console.log('Raise curtains!')
	// console.log(slack.payload)
	setupSlackWebhooks(slack)
}

const director = {
	raiseCurtains,
}

module.exports = director
