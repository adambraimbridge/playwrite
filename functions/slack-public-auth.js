const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, NETLIFY_AUTH_TOKEN, NETLIFY_PLAYWRITE_SITE_ID } = process.env
const { WebClient } = require('@slack/web-api')
const NetlifyAPI = require('netlify')

// @see https://api.slack.com/authentication/oauth-v2
// @see https://slack.dev/node-slack-sdk/web-api#exchange-an-oauth-grant-for-a-token
exports.handler = async (request) => {
	console.debug(`🕶 Slack app auth`)
	const netlifyClient = new NetlifyAPI(NETLIFY_AUTH_TOKEN)
	const { code } = request.queryStringParameters
	const slackWebClient = new WebClient()
	const oauthResponse = await slackWebClient.oauth.v2 //
		.access({
			code,
			client_id: SLACK_CLIENT_ID,
			client_secret: SLACK_CLIENT_SECRET,
		})
		.catch((error) => {
			return {
				statusCode: 500,
				body: error.message,
			}
		})

	if (!oauthResponse || !oauthResponse.ok) {
		return {
			statusCode: 500,
			body: `🎭 Sorry. Could not access Slack.`,
		}
	}
	const { id: team_id } = oauthResponse.team

	console.debug(`🕶 Getting netlify site metadata ...`)
	const siteMetaData = await netlifyClient //
		.getSiteMetadata({
			site_id: NETLIFY_PLAYWRITE_SITE_ID,
		})
	siteMetaData[team_id] = oauthResponse

	console.debug(`🕶 Updating netlify site metadata ...`)
	const response = await netlifyClient
		.updateSiteMetadata({
			site_id: NETLIFY_PLAYWRITE_SITE_ID,
			body: JSON.stringify(siteMetaData),
		})
		.catch((error) => {
			return {
				statusCode: 500,
				body: error.message,
			}
		})

	if (!response || !response[team_id]) {
		console.warn({ ...response })
		return {
			statusCode: 500,
			body: `🎭 Sorry. Could not save site details.`,
		}
	}

	return {
		statusCode: 302,
		headers: {
			Location: `https://playwrite.netlify.app/get-started?authenticated=true`,
			'Cache-Control': 'no-cache',
		},
		body: JSON.stringify({}),
	}
}
