const NetlifyAPI = require('netlify')
const { getAbslackt } = require('./lib/abslackt')
const { updateHomepage } = require('./lib/update-homepage')
const { cueNextMessage } = require('./lib/cue-next-message')
const { handleBlockActions } = require('./lib/handle-block-actions')
const { handleViewSubmissions } = require('./lib/handle-view-submissions')

const {
	PLAYWRITE_API_KEY, //
	NETLIFY_AUTH_TOKEN,
	NETLIFY_PLAYWRITE_SITE_ID,
} = process.env

const handler = async (request) => {
	// Guardian: An API key is required for all requests
	if (!request.headers['x-playwrite-api-key'] || request.headers['x-playwrite-api-key'] !== PLAYWRITE_API_KEY) {
		console.warn('🤔 Incorrect or missing x-playwrite-api-key')
		return {
			statusCode: 500,
			body: '🤔 Incorrect or missing key',
		}
	}

	const payload = JSON.parse(request.body)
	const { type } = payload
	console.debug(`🐬 Event type: ${type}`)

	// If the event type is 'cue_next_message', expect all the required details to be in the body payload.
	// The idea is to speed up the app logic for better performance.
	if (type === 'cue_next_message') {
		await cueNextMessage({ payload }).catch(console.error)
		return {
			statusCode: 200,
			body: '',
		}
	}

	// Guardian: Team ID is required
	const { team, team_id } = payload
	const teamId = team_id ? team_id : team.id
	if (!teamId) {
		console.warn(`🤔 Error: team not found.`)
		return {
			statusCode: 200,
			body: '',
		}
	}

	// Load Abslackt SDK
	const netlifyClient = new NetlifyAPI(NETLIFY_AUTH_TOKEN)
	const siteMetaData = await netlifyClient //
		.getSiteMetadata({
			site_id: NETLIFY_PLAYWRITE_SITE_ID,
		})
		.catch(console.error)

	const { access_token } = siteMetaData[teamId]
	if (!access_token) {
		console.warn(`🤔 Error: access_token not found.`)
		return {
			statusCode: 200,
			body: '',
		}
	}
	const abslackt = getAbslackt({ access_token })

	// Route based on action type
	if (type === 'block_actions') {
		await handleBlockActions({ access_token, abslackt, payload }).catch(console.error)
	}

	if (type === 'view_submission') {
		await handleViewSubmissions({ abslackt, payload }).catch(console.error)
	}

	// Update homepage
	const user_id = payload.event ? payload.event.user : payload.user.id
	await updateHomepage({ abslackt, user_id }).catch(console.error)

	return {
		statusCode: 200,
		body: '',
	}
}

module.exports = {
	handler,
}
