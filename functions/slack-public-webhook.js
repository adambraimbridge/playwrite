const { createEventAdapter } = require('@slack/events-api')

/**
 * Slack Public Webhook
 *
 * This function is called from Slack.
 * @see https://github.com/slackapi/node-slack-sdk
 * @see https://slack.dev/node-slack-sdk/events-api
 */

const controller = () => {
	const slackSigningSecret = process.env.SLACK_SIGNING_SECRET
	const slackEvents = createEventAdapter(slackSigningSecret, {
		includeBody: true,
		includeHeaders: true,
	})
	return slackEvents
}

exports.handler = (payload) => {
	console.log('Testing ...')
	console.log({ payload })
	const foo = controller()
	console.log({ foo })
}
