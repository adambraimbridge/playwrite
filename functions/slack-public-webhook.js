/**
 * Slack Public Webhook
 *
 * This function is called from Slack.
 * @see https://slack.dev/bolt
 */

const controller = () => {
	return {
		statusCode: 200,
		body: {
			testing: true,
		},
	}
}

exports.handler = () => {
	console.log('Testing ...')
	return controller()
}
