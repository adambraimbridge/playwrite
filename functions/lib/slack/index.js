/**
 * @param {*} body The body of the request from Slack
 */
const getPayload = ({ body }) => {
	const payload = body.payload ? body.payload : body
	return JSON.parse(payload)
}

/**
 * Route interactions and events based on Slack payload.
 * Payload is different depending on what Slack sends.
 *
 * @param {*} request The data sent from Slack
 */
const handleSlackRequest = (request) => {
	try {
		const payload = getPayload(request)
		console.log('handleSlackRequest ...')
		console.log({ payload })
	} catch (error) {
		// @todo Catch any errors and trigger an "error" event that the app can subscribe to ..?
		console.log(error.message)
	}
}

module.exports = {
	getPayload,
	handleSlackRequest,
}
