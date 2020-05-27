const axios = require('axios')
const { getPayload } = require('./lib/@adambraimbridge/abslackt')
const SITE_HOST = 'https://playwrite.netlify.app'

/**
 * Slack Public Webhook
 *
 * This function is called from Slack.
 * @see https://slack.dev/node-slack-sdk/web-api
 */
exports.handler = async (request) => {
	// Always respond with a 200 (OK) response, to let Slack know their post was received.
	// because otherwise it will time out, and Slack keeps resending the event.
	// (Note: your HTTP 200 response must be empty for this step to complete successfully.)
	// ^ @see https://api.slack.com/surfaces/modals/using#interactions#close_current_view
	const response = {
		statusCode: 200,
		body: '',
	}

	try {
		const payload = getPayload(request)

		// Handle Slack challenges. See: https://api.slack.com/events/url_verification
		const { type, challenge } = payload
		if (!!challenge && !!type && type === 'url_verification') {
			response.body = challenge
		} else {
			console.debug(`🦄 Action! Cue ${SITE_HOST}${path}`)
			const path = '/.netlify/functions/director'
			axios.post(`${SITE_HOST}${path}`, payload, {
				headers: {
					'x-playwrite-api-key': process.env.PLAYWRITE_API_KEY,
				},
			})
		}
	} catch (error) {
		console.error(error)
	}
	return response
}
