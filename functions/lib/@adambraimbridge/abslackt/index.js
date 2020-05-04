const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN)

/**
 * Payload is different depending on what Slack sends.
 * @param {*} body The body of the request from Slack
 */
const getPayload = ({ body }) => {
	let payload = false
	try {
		// Slack "Events"
		payload = JSON.parse(body)
	} catch (error) {
		// Slack "Interactions"
		payload = JSON.parse(decodeURIComponent(body).replace('payload=', ''))
	}
	return payload
}

const abslact = (request) => {
	const payload = getPayload(request)
	const hooks = []

	// Publish to the App home page for the user.
	const publish = ({ user_id, view }) => {
		slackWebClient.views.publish({ user_id, view })
	}

	const invokeCallbacks = async ({ event, hooks }) => {
		const type = event && event.type ? event.type : payload.type
		hooks
			.filter((hook) => hook.type === type)
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
		// console.log({ results })
	}

	return {
		payload,
		publish,
		on,
		run,
	}
}

module.exports = abslact
