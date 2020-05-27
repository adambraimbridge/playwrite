const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient()

// @see https://api.slack.com/authentication/oauth-v2
// @see https://slack.dev/node-slack-sdk/web-api#exchange-an-oauth-grant-for-a-token
exports.handler = async (request) => {
	const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } = process.env
	const { code } = request.queryStringParameters

	console.log(`🦄 https://slack.com/api/oauth.v2.access?code=${code}&client_id=${SLACK_CLIENT_ID}&client_secret=${SLACK_CLIENT_SECRET}`)

	const response = await slackWebClient.oauth.v2 //
		.access({
			code,
			client_id: SLACK_CLIENT_ID,
			client_secret: SLACK_CLIENT_SECRET,
		})
		.catch(console.error)

	console.log({ ...response })

	return {
		statusCode: 200,
		body: 'slack-public-auth',
	}
}

// const NetlifyAPI = require('netlify')
// const client = new NetlifyAPI('1234myAccessToken')
// const sites = await client.listSites()
