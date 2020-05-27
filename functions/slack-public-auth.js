const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, NETLIFY_AUTH_TOKEN, NETLIFY_PLAYWRITE_SITE_ID } = process.env
const { WebClient } = require('@slack/web-api')
const slackWebClient = new WebClient()
const NetlifyAPI = require('netlify')
const netlifyClient = new NetlifyAPI(NETLIFY_AUTH_TOKEN)

// @see https://api.slack.com/authentication/oauth-v2
// @see https://slack.dev/node-slack-sdk/web-api#exchange-an-oauth-grant-for-a-token
exports.handler = async (request) => {
	console.log(`🦄 Slack app auth`)
	const { code } = request.queryStringParameters
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
			body: `Sorry. Could not access Slack.`,
		}
	}
	const { id: team_id } = oauthResponse.team

	console.log(`🦄 Getting netlify site metadata ...`)
	const siteMetaData = await netlifyClient //
		.getSiteMetadata({
			site_id: NETLIFY_PLAYWRITE_SITE_ID,
		})
	siteMetaData[team_id] = oauthResponse

	console.log(`🦄 Updating netlify site metadata ...`)
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

	console.log({ ...response })
	if (!response || !response.ok) {
		return {
			statusCode: 500,
			body: `Sorry. Could not save site details.`,
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
