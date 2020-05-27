const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, NETLIFY_AUTH_TOKEN, NETLIFY_PLAYWRITE_SITE_ID } = process.env
const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient()
const NetlifyAPI = require('netlify')
const netlifyClient = new NetlifyAPI(NETLIFY_AUTH_TOKEN)

// @see https://api.slack.com/authentication/oauth-v2
// @see https://slack.dev/node-slack-sdk/web-api#exchange-an-oauth-grant-for-a-token
exports.handler = async (request) => {
	const { code } = request.queryStringParameters
	const oauthResponse = await slackWebClient.oauth.v2 //
		.access({
			code,
			client_id: SLACK_CLIENT_ID,
			client_secret: SLACK_CLIENT_SECRET,
		})
		.catch(console.error)
	if (!oauthResponse || !oauthResponse.ok) {
		return {
			statusCode: 500,
		}
	}
	const { id: team_id } = oauthResponse.team

	const siteMetaData = await netlifyClient //
		.getSiteMetadata({
			site_id: NETLIFY_PLAYWRITE_SITE_ID,
		})
	siteMetaData[team_id] = oauthResponse

	const response = await netlifyClient
		.updateSiteMetadata({
			site_id: NETLIFY_PLAYWRITE_SITE_ID,
			body: JSON.stringify(siteMetaData),
		})
		.catch(console.error)
	if (!response || !response.ok) {
		return {
			statusCode: 500,
		}
	}

	return {
		statusCode: 302,
		headers: {
			Location: `//get-started?authenticated=true`,
			'Cache-Control': 'no-cache',
		},
		body: JSON.stringify({}),
	}
}
