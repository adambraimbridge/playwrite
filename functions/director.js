const NetlifyAPI = require('netlify')
const { cueNextMessage } = require('./lib/cue-next-message')
const { updateHomepage } = require('./lib/update-homepage')
const { handleBlockActions } = require('./lib/handle-block-actions')
const { handleViewSubmissions } = require('./lib/handle-view-submissions')

const {
	PLAYWRITE_API_KEY, //
	NETLIFY_AUTH_TOKEN,
	NETLIFY_PLAYWRITE_SITE_ID,
} = process.env

const getSlackAccessToken = async (payload) => {
	// Guardian: Team ID is required
	const { team, team_id } = payload
	const teamId = team_id ? team_id : team.id
	if (!teamId) {
		console.warn(`🤔 Error: team not found.`)
		return false
	}

	// Load the Slack access_token (required for the Abslackt SDK)
	const netlifyClient = new NetlifyAPI(NETLIFY_AUTH_TOKEN)
	const siteMetaData = await netlifyClient //
		.getSiteMetadata({
			site_id: NETLIFY_PLAYWRITE_SITE_ID,
		})
		.catch(console.error)

	const { access_token } = siteMetaData[teamId]
	if (!access_token) {
		console.warn(`🤔 Error: access_token not found for team: ${teamId}`)
		return false
	}

	return {
		access_token,
	}
}

const okay = {
	statusCode: 200,
	body: '',
}
const handler = async (request) => {
	// Guardian: A payload is required for all requests
	const payload = JSON.parse(request.body)
	if (!payload) {
		console.warn('🤔 Missing payload')
		return okay
	}

	// Guardian: An API key is required for all requests
	if (!request.headers['x-playwrite-api-key'] || request.headers['x-playwrite-api-key'] !== PLAYWRITE_API_KEY) {
		console.warn('🤔 Incorrect or missing x-playwrite-api-key')
		return okay
	}

	// Guardian: Slack access_token is required for all requests
	const { access_token } = await getSlackAccessToken(payload)
	if (!access_token) {
		console.warn('🤔 Incorrect or missing access_token')
		return okay
	}

	const { type, event } = payload
	console.debug(`🐬 Director! Request type: ${type}. Event type: ${event.type}`)

	// Update homepage
	if (!!event && event.type === 'app_home_opened') {
		const { user: user_id } = event
		updateHomepage({ access_token, user_id }).catch(console.error)
		return okay
	}

	// Guardian: Only handle request events we can identify
	if (!['block_actions', 'view_submission'].includes(type)) {
		console.debug(`Unhandled request type: ${type}`)
		return okay
	}

	// If the event type is 'cue_next_message', expect all the required details to be in the body payload.
	// The idea is to speed up the app logic for better performance.
	if (type === 'cue_next_message') {
		await cueNextMessage({ payload }).catch(console.error)
		return okay
	}

	// Route based on action type
	if (type === 'block_actions') {
		// await handleBlockActions({ payload }).catch(console.error)
	}

	if (type === 'view_submission') {
		// await handleViewSubmissions({ payload }).catch(console.error)
	}

	return okay
}

module.exports = {
	handler,
}
