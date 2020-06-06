// https://api.slack.com/methods/chat.postMessage
const postMessage = async ({ slackWebClient, view }) => {
	await slackWebClient.chat
		.postMessage(view) //
		.catch(console.error)
}

// https://api.slack.com/methods/chat.update
const updateMessage = async ({ slackWebClient, channel, ts, blocks }) => {
	await slackWebClient.chat
		.update({ channel, ts, blocks }) //
		.catch(console.error)
}

module.exports = {
	postMessage,
	updateMessage,
}
