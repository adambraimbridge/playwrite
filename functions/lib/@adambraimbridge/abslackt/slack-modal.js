const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN)

const getModalJson = ({ trigger_id, callback_id, title }) => ({
	trigger_id,
	view: {
		callback_id,
		type: 'modal',
		title: {
			type: 'plain_text',
			text: title,
		},
		blocks: [
			{
				type: 'section',
				block_id: 'loading',
				text: {
					type: 'mrkdwn',
					text: ' ... ',
				},
			},
		],
	},
})

const spawnModal = async ({ trigger_id, callback_id, title }) => {
	const response = await slackWebClient.views //
		.open(getModalJson({ trigger_id, callback_id, title }))
		.catch(console.error)

	return response
}

const updateModal = async ({ view_id, view }) => {
	const response = await slackWebClient.views //
		.update({ view_id, view })
		.catch(console.error)

	return response
}

module.exports = {
	spawnModal,
	updateModal,
}
