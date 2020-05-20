/**
 * abslackt == "[A]dam + [B]raimbridge + "[Slack] + abstrac[t]"
 */
const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN)
const { spawnModal, updateModal } = require('./modals')
const { sendMessages } = require('./messages')
const { getConversation } = require('./conversations')
const { getUser } = require('./users')

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
const publish = ({ user_id, view }) => {
	slackWebClient.views.publish({ user_id, view })
}

module.exports = {
	getPayload,
	publish,
	spawnModal,
	updateModal,
	sendMessages,
	getConversation,
	getUser,
}
