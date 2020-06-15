const cueNextMessage = async ({ payload }) => {
	console.debug(`🎱 Cueing next message`)
	const {
		access_token, //
		currentLineNumber,
		conversationId,
		cast,
		playId,
	} = payload

	// @todo refactor this dupe
	const nowShowing = await getPlay({ playId })
	if (!nowShowing) {
		console.warn(`🐶 Play not found for "${thePlayId}".`)
		return false
	}

	const { getTranscript } = nowShowing
	const transcript = getTranscript({ player: cast.player })
	const nextLineNumber = currentLineNumber + 1
	const currentLine = transcript[nextLineNumber]

	await postMessage({
		access_token,
		currentLineNumber: nextLineNumber,
		conversationId,
		cast,
		playId,
		currentLine,
	}).catch(console.error)
}

module.exports = {
	cueNextMessage,
}
