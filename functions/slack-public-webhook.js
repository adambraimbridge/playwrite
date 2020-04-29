/**
 * Slack Public Webhook
 *
 * This function is called from Slack.
 * @see https://github.com/slackapi/node-slack-sdk
 * @see https://slack.dev/node-slack-sdk/web-api
 */

const { getPayload, handleSlackRequest } = require('./lib/slack')

exports.handler = (request) => {
	/**
	 * Hand over to the slack router
	 *
	 * Do not await a response, because otherwise it will time out,
	 * and Slack would keep resending the event.
	 */
	handleSlackRequest(request)

	// Handle Slack challenges. See: https://api.slack.com/events/url_verification
	const payload = getPayload(request)
	const { type, challenge } = payload
	const body = type === 'url_verification' && !!challenge ? challenge : 'ok'

	// Always respond with OK
	return {
		statusCode: 200,
		body,
	}
}
