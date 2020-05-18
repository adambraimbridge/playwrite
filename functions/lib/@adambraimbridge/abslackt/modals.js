const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN)

const spawnModal = async ({ trigger_id, view }) => {
	console.debug(`🦄 Spawning modal. trigger_id = ${trigger_id}`)
	const response = await slackWebClient.views //
		.open({ trigger_id, view })
		.catch(console.error)

	return response
}

const updateModal = async ({ view_id, view }) => {
	console.debug(`🐶 Updating modal. view_id = ${view_id}`)
	const response = await slackWebClient.views //
		.update({ view_id, view })
		.catch(console.error)

	return response
}

module.exports = {
	spawnModal,
	updateModal,
}
