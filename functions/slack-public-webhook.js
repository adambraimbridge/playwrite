const abslackt = require('./lib/@adambraimbridge/abslackt')
const director = require('./lib/director')

/**
 * Slack Public Webhook
 *
 * This function is called from Slack.
 * @see https://slack.dev/node-slack-sdk/web-api
 */
exports.handler = (request) => {
	// Always respond with a 200 (OK) response, to let Slack know their post was received.
	// because otherwise it will time out, and Slack keeps resending the event.
	const response = {
		statusCode: 200,
		body: 'ok',
	}

	try {
		const slack = abslackt(request)

		// Handle Slack challenges. See: https://api.slack.com/events/url_verification
		const { type, challenge } = slack.payload
		if (!!challenge && !!type && type === 'url_verification') {
			response.body = challenge
		} else {
			// Do not await a response.
			director.raiseCurtains(slack)
			slack.run()
		}
	} catch (error) {
		console.error(error)
	}
	return response
}
