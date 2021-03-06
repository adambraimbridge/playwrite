const axios = require('axios')
const SITE_HOST = process.env.NETLIFY_DEV === 'true' ? 'https://playwrite.ngrok.io' : 'https://playwrite.netlify.app'
const { getPayload } = require('./lib/abslackt')
/**
 * Slack Public Webhook
 *
 * This function is called from Slack.
 * @see https://slack.dev/node-slack-sdk/web-api
 */
exports.handler = async (request) => {
	// Always respond with a 200 (OK) response, to let Slack know their post was received.
	// because otherwise it will time out, and Slack keeps resending the event.
	// (Note: HTTP 200 response must be empty for this step to complete successfully.)
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
			const path = '/.netlify/functions/director'
			await axios
				.post(`${SITE_HOST}${path}`, payload, {
					headers: {
						'x-playwrite-api-key': process.env.PLAYWRITE_API_KEY,
					},
				})
				.catch(console.error)
		}
	} catch (error) {
		console.error(error)
	}
	return response
}
