// abslackt === "[A]dam + [B]raimbridge + "[Slack] + abstrac[t]"
const abslackt = require('./lib/@adambraimbridge/abslackt')
const homepage = require('./plays/homepage')
const { view } = require('./plays/ltv-in-the-jungle')

const setupSlackWebhooks = (slack) => {
	slack.on('error', () => {
		console.log(`Slack error 01: ${error.message}`)
	})

	slack.on('app_home_opened', async () => {
		const { user, tab } = slack.payload.event
		const { view } = homepage
		view.type = tab
		const response = await slack.publish({ user_id: user, view })
		return response
	})

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

		view.callback_id = callback_id
		const response = await slack.updateModal({ view_id, view })

		return response
	})
}

/**
 * Slack Public Webhook
 *
 * This function is called from Slack.
 * @see https://github.com/slackapi/node-slack-sdk
 * @see https://slack.dev/node-slack-sdk/web-api
 */
exports.handler = (request) => {
	// Always respond with a 200 (OK) response, to let Slack know their post was received.
	const response = {
		statusCode: 200,
		body: 'ok',
	}

	try {
		// Handle Slack challenges. See: https://api.slack.com/events/url_verification
		const slack = abslackt(request)
		const { type, challenge } = slack.payload
		if (!!challenge && !!type && type === 'url_verification') {
			response.body = challenge
		} else {
			/**
			 * Do not await a response, because otherwise it will time out,
			 * and Slack keeps resending the event.
			 */
			setupSlackWebhooks(slack)
			slack.run()
		}
	} catch (error) {
		console.error(error)
	}
	return response
}
