const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN)

const getUser = async ({ user }) => {
	const response = await slackWebClient.users //
		.info({ user })
		.catch(console.error)

	return response.user
}

module.exports = {
	getUser,
}
