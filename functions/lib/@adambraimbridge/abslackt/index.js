/**
 * abslackt == "[A]dam + [B]raimbridge + "[Slack] + abstrac[t]"
 */
const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN)
const { spawnModal, updateModal } = require('./modal')
const { sendMessages } = require('./message')

/**
 * The payload is different depending on what Slack sends.
 * This function normalises the payload from a string to a json object.
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

	// Process any callbacks that have been queued
	const invokeCallbacks = async ({ event, hooks }) => {
		const type = event && event.type ? event.type : payload.type
		hooks
			.filter((hook) => hook.type === type)
			.forEach((hook) => {
				hook.callback()
			})
	}

	// Queue a callback for a Slack event type
	const on = (type, callback) => {
		// @todo Add a guardian for callback types.
		hooks.push({ type, callback })
	}

	// Primary controller for a Slack request
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
		spawnModal,
		updateModal,
		sendMessages,
	}
}

module.exports = abslact
