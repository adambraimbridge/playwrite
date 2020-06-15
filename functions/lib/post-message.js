const postMessage = async ({ currentLineNumber, currentLine, action, state, access_token, playId, cast, conversationId }) => {
	console.debug(`💌 Type: Message.`)
	let message = currentLine
	let playNextMessage = true

	// If the action was an option in a message,
	//  1. Find the option in the transcript that matches the`action_id`
	//  2. Then send the appropriate response message to the conversation channel.
	//     @todo handle responses that are modals
	if (!!action && action.includes('option-')) {
		const { optionNumber } = state
		const selectedOption = currentLine.options[optionNumber]
		message = selectedOption.response
		playNextMessage = !!selectedOption.playNextMessage // This will "pause" the play unless `playNextMessage` is explicitly set to `true`
	}

	console.debug(`💌 Posting line #${currentLineNumber} to ${SITE_HOST}/.netlify/functions/post-message`)
	const messageData = {
		access_token,
		playId,
		cast,
		message,
		conversationId,
		currentLineNumber,
		playNextMessage,
	}
	const response = await axios
		.post(`${SITE_HOST}/.netlify/functions/post-message`, messageData, {
			headers: {
				'x-playwrite-api-key': PLAYWRITE_API_KEY,
			},
		})
		.catch(console.error)
	console.debug(`💌 Message #${currentLineNumber}: ${response.status}`)
}

module.exports = {
	postMessage,
}
