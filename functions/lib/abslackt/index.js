const { WebClient } = require('@slack/web-api')
const { getUser } = require('./users')
const { postMessage } = require('./messages')
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
		publish: (args) => publish({ slackWebClient, ...args }),
		spawnModal: (args) => spawnModal({ slackWebClient, ...args }),
		updateModal: (args) => updateModal({ slackWebClient, ...args }),
		postMessage: (args) => postMessage({ slackWebClient, ...args }),
		getConversation: (args) => getConversation({ slackWebClient, ...args }),
		createConversation: (args) => createConversation({ slackWebClient, ...args }),
		yeetConversation: (args) => yeetConversation({ slackWebClient, ...args }),
		getUser: (args) => getUser({ slackWebClient, ...args }),
	}
}

module.exports = {
	getPayload,
	getAbslackt,
}
