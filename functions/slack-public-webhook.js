/**
 * Slack Public Webhook
 *
 * This function is called from Slack.
 * @see https://github.com/slackapi/node-slack-sdk
 * @see https://slack.dev/node-slack-sdk/web-api
 */

const { slack } = require('./lib/slack')

exports.handler = (payload) => {
	console.log('Testing ...')
	console.log({ payload })

	// Always respond with OK
	return {
		statusCode: 200,
		body: 'ok',
	}
}
