const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN)

/**
 * Payload is different depending on what Slack sends.
 * @param {*} body The body of the request from Slack
 */
const getPayload = ({ body }) => {
	const payload = body.payload ? body.payload : body
	try {
		return JSON.parse(payload)
	} catch (error) {
		// @todo Catch any errors and trigger an "error" event that the app can subscribe to ..?
		console.log(error.message)
		return false
	}
}

const abslact = (request) => {
	const payload = getPayload(request)
	const hooks = []

	// Publish to the App home page for the user.
	const publish = ({ user_id, view }) => {
		slackWebClient.views.publish({ user_id, view })
	}

	const invokeCallbacks = async ({ event, hooks }) => {
		hooks
			.filter((hook) => hook.type === event.type)
			.forEach((hook) => {
				hook.callback()
			})
	}

	const on = (type, callback) => {
		// @todo Add a guardian for callback types.
		hooks.push({ type, callback })
	}

	const run = async () => {
		const { event } = payload
		const results = await invokeCallbacks({ event, hooks })
		console.log({ results })
	}

	return {
		payload,
		publish,
		on,
		run,
	}
}

module.exports = abslact
