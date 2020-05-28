const { WebClient } = require('@slack/web-api')
const { getUser } = require('./users')
const { sendMessages } = require('./messages')
const { spawnModal, updateModal } = require('./modals')
const { getConversation, createConversation, yeetConversation } = require('./conversations')

/**
 * The payload is different depending on what Slack sends.
 * This function normalises the payload from a string to a json object.
 * @param {*} body The body of the request from Slack
 */
const getPayload = ({ body }) => {
	let payload = false
	try {
		// Slack "Events"
		const json = JSON.parse(body)
		payload = json.payload || json
	} catch (error) {
		// Slack "Interactions"
		payload = JSON.parse(decodeURIComponent(body).replace('payload=', ''))
	}
	return payload
}

// Publish to the App home page for the user.
const publish = async ({ slackWebClient, user_id, view }) => {
	await slackWebClient.views.publish({ user_id, view })
}

const getAbslackt = ({ access_token }) => {
	const slackWebClient = new WebClient(access_token)
	return {
		publish: (arguments) => publish({ slackWebClient, ...arguments }),
		spawnModal: (arguments) => spawnModal({ slackWebClient, ...arguments }),
		updateModal: (arguments) => updateModal({ slackWebClient, ...arguments }),
		sendMessages: (arguments) => sendMessages({ slackWebClient, ...arguments }),
		getConversation: (arguments) => getConversation({ slackWebClient, ...arguments }),
		createConversation: (arguments) => createConversation({ slackWebClient, ...arguments }),
		yeetConversation: (arguments) => yeetConversation({ slackWebClient, ...arguments }),
		getUser: (arguments) => getUser({ slackWebClient, ...arguments }),
	}
}

module.exports = {
	getPayload,
	getAbslackt,
}
