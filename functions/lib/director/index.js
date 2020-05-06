const plays = require('../../plays')

const getNextView = ({ act = 'actOne', line = 1 }) => {
	const lines = [act]
	const currentline = lines[Symbol.iterator]()

	console.log('currentline')
	console.log({ ...currentline })

	console.log(currentline.next().value)
	console.log(currentline.next().value)
	console.log(currentline.next().value)

	return {
		type: 'modal',
		title: {
			type: 'plain_text',
			text: `LTV in the Jungle`,
			emoji: true,
		},
		submit: {
			type: 'plain_text',
			text: `Continue`,
			emoji: true,
		},
		close: {
			type: 'plain_text',
			text: `Close`,
			emoji: true,
		},
		blocks: [
			{
				type: 'context',
				elements: [
					{
						type: 'mrkdwn',
						text: `*It's early morning. You find yourself at your normal job, working for Friendly Team™.* \n\nYou’re in charge of managing a portfolio of clients who pay subscription fees to access FT content.`,
					},
				],
			},
		],
	}
}

const setupSlackWebhooks = (slack) => {
	// @todo: Capture errors for nicer UX
	slack.on('error', () => {
		console.log(`Slack error 01: ${error.message}`)
	})

	// User clicked the app home page
	slack.on('app_home_opened', async () => {
		const { user, tab } = slack.payload.event
		const { homepage: view } = plays
		view.type = tab
		const response = await slack.publish({ user_id: user, view })
		return response
	})

	// User clicked a button inside a block
	slack.on('block_actions', async () => {
		const callback_id = slack.payload.actions[0].value
		const { trigger_id } = slack.payload
		const title =
			callback_id === 'ltv-in-the-jungle' //
				? 'LTV in the Jungle'
				: callback_id === 'journalist-or-pugalist'
				? 'Journalist or Pugalist?'
				: 'Details'

		const slackModal = await slack.spawnModal({ trigger_id, callback_id, title })
		const { id: view_id } = slackModal.view

		// Play the lines from the first act
		play(actOne)
		view.callback_id = callback_id
		const response = await slack.updateModal({ view_id, view })

		return response
	})

	// // User clicked a button at the bottom of a modal
	// slack.on('view_submission', async () => {
	// 	const { id: view_id, callback_id } = slack.payload.view

	// 	view.callback_id = callback_id
	// 	const response = await slack.updateModal({ view_id, view })

	// 	return response
	// })
}

const places = (slack) => {
	console.log('director')
	console.log(slack.payload)
	setupSlackWebhooks(slack)
}

const director = {
	places,
}

module.exports = director
